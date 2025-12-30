import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule'; // แนะนำใช้ CronExpression จะอ่านง่ายกว่า '0 3 * * *'
import { PrismaService } from '../prisma/prisma.service';
import { PointTransactionType } from '@prisma/client';

@Injectable()
export class PointExpirationService {
  private readonly logger = new Logger(PointExpirationService.name);

  constructor(private readonly prisma: PrismaService) {}

  // รันทุกตี 3 ของทุกวัน
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async expirePoints() {
    this.logger.log('🕒 Starting point expiration job...');
    const now = new Date();

    let hasMore = true;
    let processedCount = 0;
    let deductedCount = 0;

    while (hasMore) {
      // 1. ดึงรายการที่หมดอายุ และยังไม่ถูกจัดการ
      const expiredTransactions = await this.prisma.pointTransaction.findMany({
        where: {
          type: PointTransactionType.EARN_DEPOSIT, // เฉพาะแต้มขาเข้า
          expiresAt: { lt: now }, // เลยกำหนดแล้ว
          isExpiredProcessed: false, // ยังไม่เคยรัน Job นี้
        },
        take: 100, // Batch Size: 100
        include: { member: true },
      });

      if (expiredTransactions.length === 0) {
        hasMore = false;
        break;
      }

      for (const tx of expiredTransactions) {
        try {
          await this.prisma.$transaction(async (prisma) => {
            // Lock แถว Member ไว้ (กันคนแย่งใช้แต้มตอน Job รัน)
            const member = await prisma.member.findUnique({
              where: { id: tx.memberId },
              select: { id: true, currentPoints: true, version: true },
            });

            // Case A: ไม่เจอ Member (อาจโดนลบไปแล้ว) -> Mark as Processed จบข่าว
            if (!member) {
              await prisma.pointTransaction.update({
                where: { id: tx.id },
                data: { isExpiredProcessed: true },
              });
              return;
            }

            // Case B: คำนวณยอดที่ต้องหัก (Senior Logic 🧠)
            // หลักการ: หักเท่าที่หักได้ แต่ห้ามติดลบ (Assume ว่าถ้าแต้มเหลือน้อยกว่ายอดหมดอายุ แสดงว่าใช้ก้อนนั้นไปแล้ว)
            // ตัวอย่าง: หมดอายุ 100 แต้ม แต่ User เหลือ 20 แต้ม -> หักแค่ 20 แต้มพอ
            const deductAmount = Math.min(member.currentPoints, tx.amount);

            // ถ้าไม่มีแต้มให้หักเลย (เหลือ 0) -> ไม่ต้องสร้าง Transaction ลบ
            if (deductAmount <= 0) {
              await prisma.pointTransaction.update({
                where: { id: tx.id },
                data: { isExpiredProcessed: true },
              });
              this.logger.debug(
                `Skipped deduction for Tx #${tx.id} (User balance is 0)`,
              );
              return;
            }

            // Case C: ดำเนินการหักแต้ม
            const newBalance = member.currentPoints - deductAmount;

            // 1. บันทึก Transaction การหมดอายุ
            await prisma.pointTransaction.create({
              data: {
                memberId: member.id,
                type: PointTransactionType.POINT_EXPIRED,
                amount: -deductAmount, // ติดลบตามจำนวนที่หักจริง
                balanceAfter: newBalance,
                createdBy: 'SYSTEM_JOB',
                detail: `Expired from Tx #${tx.id} (Original: ${tx.amount}, Deducted: ${deductAmount})`,
              },
            });

            // 2. อัปเดตแต้ม Member
            await prisma.member.update({
              where: { id: member.id, version: member.version },
              data: {
                currentPoints: newBalance,
                version: { increment: 1 },
              },
            });

            // 3. Mark ว่ารายการต้นทางถูกจัดการแล้ว
            await prisma.pointTransaction.update({
              where: { id: tx.id },
              data: { isExpiredProcessed: true },
            });

            deductedCount++;
          });
        } catch (e) {
          // Log error แต่ไม่หยุด Loop (Fault Tolerance)
          this.logger.error(
            `❌ Failed to expire tx ${tx.id}: ${e.message}`,
            e.stack,
          );
        }
      }

      processedCount += expiredTransactions.length;
    }

    this.logger.log(
      `✅ Job finished. Processed: ${processedCount}, Actually Deducted: ${deductedCount}`,
    );
  }
}
