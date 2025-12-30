import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PointTransactionType,
  DepositStatus,
  MemberStatus,
} from '@prisma/client';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositService {
  constructor(private readonly prisma: PrismaService) {}

  // ❌ ตัด staffId ออก เพราะ Kiosk ส่งมา
  async createDeposit(data: CreateDepositDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. เช็ค Member
      const member = await tx.member.findUnique({
        where: { id: data.memberId },
      });

      if (!member)
        throw new NotFoundException(`ไม่พบสมาชิก ID: ${data.memberId}`);
      if (member.status === MemberStatus.BANNED) {
        throw new ForbiddenException('สมาชิกรายนี้ถูกระงับการใช้งาน');
      }

      // 2. ดึงราคาขยะ (WasteType) ทั้งหมดที่ส่งมา
      const wasteTypeIds = data.items.map((item) => item.wasteTypeId);
      const wasteTypes = await tx.wasteType.findMany({
        where: { id: { in: wasteTypeIds } },
      });
      const wasteTypeMap = new Map(wasteTypes.map((wt) => [wt.id, wt]));

      // 3. คำนวณแต้ม และ เตรียมข้อมูลสำหรับ save
      let totalPoints = 0;
      const depositsToCreate = [];

      for (const item of data.items) {
        const wasteType = wasteTypeMap.get(item.wasteTypeId);

        // Validation
        if (!wasteType)
          throw new BadRequestException(
            `ไม่พบประเภทขยะ ID ${item.wasteTypeId}`,
          );
        if (!wasteType.isActive)
          throw new BadRequestException(
            `ประเภทขยะ ${wasteType.name} ปิดรับฝากชั่วคราว`,
          );

        // คำนวณแต้ม (น้ำหนัก * เรทราคา)
        const pointEarned = Math.floor(
          item.amount * Number(wasteType.pointRate),
        );
        totalPoints += pointEarned;

        // เตรียม object สำหรับ createMany
        // (Schema เดิมของคุณ: Deposit ผูกกับ WasteType โดยตรง)
        depositsToCreate.push({
          memberId: data.memberId,
          wasteTypeId: item.wasteTypeId,
          amount: Number(item.amount), // 👈 ใส่ Number() ครอบกันเหนียว
          pointEarned: pointEarned,
          status: DepositStatus.COMPLETED,
          note: 'Kiosk Deposit',
        });
      }

      // 4. บันทึก Deposit ทีเดียวหลายแถว (Bulk Insert) ⚡️
      await tx.deposit.createMany({
        data: depositsToCreate,
      });

      // 5. อัปเดตแต้ม Member (Optimistic Locking)
      const newBalance = member.currentPoints + totalPoints;
      try {
        await tx.member.update({
          where: {
            id: member.id,
            version: member.version,
          },
          data: {
            currentPoints: newBalance,
            version: { increment: 1 },
          },
        });
      } catch (error) {
        throw new ConflictException(
          'ข้อมูลแต้มมีการเปลี่ยนแปลง (Race Condition) กรุณาลองใหม่อีกครั้ง',
        );
      }

      // 6. สร้าง Transaction Log (ใบสรุปยอด)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);

      await tx.pointTransaction.create({
        data: {
          memberId: data.memberId,
          type: PointTransactionType.EARN_DEPOSIT,
          amount: totalPoints,
          balanceAfter: newBalance,
          createdBy: 'KIOSK',
          expiresAt,
          detail: `ฝากขยะ ${depositsToCreate.length} รายการ (รวม ${totalPoints} แต้ม)`,
        },
      });

      // ✅ ปรับ Return ให้สมบูรณ์สำหรับหน้าตู้ Kiosk
      return {
        success: true,
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`, // 👈 เพิ่มชื่อกลับไปด้วย
        earnedPoints: totalPoints,
        newBalance: newBalance,
        itemsCount: depositsToCreate.length,
      };
    });
  }
  async getMyStats(memberId: string) {
    // 1. หา "น้ำหนักรวม" (ตัวส่วน)
    const totalWeight = await this.prisma.deposit.aggregate({
      where: { memberId },
      _sum: { amount: true },
      _count: { id: true },
    });

    // ดึงค่า total ออกมาเตรียมไว้ (ถ้าไม่มีให้เป็น 0)
    const totalKg = Number(totalWeight._sum.amount) || 0;

    // 2. Group ตามประเภทขยะ (ตัวเศษ)
    const statsByWasteType = await this.prisma.deposit.groupBy({
      by: ['wasteTypeId'],
      where: { memberId },
      _sum: { amount: true },
    });

    // 3. Mapping ชื่อ + คำนวณ %
    const wasteTypes = await this.prisma.wasteType.findMany();
    const wasteTypeMap = new Map(wasteTypes.map((w) => [w.id, w]));

    const breakdown = statsByWasteType.map((item) => {
      const typeInfo = wasteTypeMap.get(item.wasteTypeId);
      const currentAmount = Number(item._sum.amount) || 0;

      // 🧮 สูตรคำนวณ %: (จำนวนย่อย / จำนวนรวม) * 100
      // ระวังตัวหารเป็น 0
      const percent = totalKg > 0 ? (currentAmount / totalKg) * 100 : 0;

      return {
        wasteName: typeInfo?.name || 'Unknown',
        totalAmount: currentAmount,
        unit: typeInfo?.unit || 'kg',
        // ปัดทศนิยม 2 ตำแหน่ง เพื่อความสวยงาม (เช่น 33.33)
        percentage: parseFloat(percent.toFixed(2)),
      };
    });

    // เรียงจากมากไปน้อย
    breakdown.sort((a, b) => b.totalAmount - a.totalAmount);

    return {
      summary: {
        totalSavedKg: totalKg,
        totalTransactions: totalWeight._count.id || 0,
      },
      breakdown,
    };
  }
}
