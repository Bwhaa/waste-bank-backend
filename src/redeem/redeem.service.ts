import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PointTransactionType,
  RedemptionStatus,
  MemberStatus,
} from '@prisma/client';

@Injectable()
export class RedeemService {
  private readonly logger = new Logger(RedeemService.name);

  constructor(private readonly prisma: PrismaService) {}
  async findAllPending() {
    return this.prisma.rewardRedemption.findMany({
      where: { status: RedemptionStatus.REQUESTED },
      include: {
        member: {
          select: { firstName: true, lastName: true, email: true },
        },
        reward: {
          select: { id: true, name: true, imageUrl: true, costPoint: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  // 1. Redeem: ตัดแต้ม + ตัดของ ทันที ⚡️
  async redeem(memberId: string, rewardId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1.1 เช็คของรางวัล
      const reward = await tx.reward.findUnique({
        where: { id: rewardId },
        // เพิ่มการ select version มาด้วย ไม่งั้นตอน update ขั้นตอน 1.3 จะ error
        select: {
          id: true,
          name: true,
          costPoint: true,
          stock: true,
          isActive: true,
          version: true,
        },
      });

      if (!reward || !reward.isActive) {
        throw new BadRequestException('Reward not available');
      }
      if (reward.stock <= 0) {
        throw new BadRequestException('Reward is out of stock');
      }

      // 1.2 เช็คสมาชิก
      const member = await tx.member.findUnique({
        where: { id: memberId },
        select: { id: true, currentPoints: true, version: true, status: true },
      });

      if (!member) throw new NotFoundException('Member not found');
      if (member.status === MemberStatus.BANNED) {
        throw new ForbiddenException('Member is banned');
      }
      if (member.currentPoints < reward.costPoint) {
        throw new BadRequestException(
          `Not enough points. Required: ${reward.costPoint}, Current: ${member.currentPoints}`,
        );
      }

      // 1.3 🔥 ตัด Stock ทันที (Optimistic Lock)
      try {
        await tx.reward.update({
          where: {
            id: rewardId,
            version: reward.version, // กันคนแย่งกันกด
          },
          data: {
            stock: { decrement: 1 },
            version: { increment: 1 },
          },
        });
      } catch (error) {
        throw new ConflictException(
          'Item was just taken by someone else. Please try again.',
        );
      }

      // 1.4 หักแต้มสมาชิก
      const newBalance = member.currentPoints - reward.costPoint;

      try {
        await tx.member.update({
          where: { id: memberId, version: member.version },
          data: {
            currentPoints: newBalance,
            version: { increment: 1 },
          },
        });
      } catch (error) {
        // ถ้าตัดแต้มไม่ผ่าน (เช่นแต้มเปลี่ยน) ต้อง Rollback ทั้งหมด (Prisma ทำให้อัตโนมัติ)
        throw new ConflictException(
          'Member points updated by another process.',
        );
      }

      // 1.5 สร้างใบคำขอแลก
      const redemption = await tx.rewardRedemption.create({
        data: {
          memberId,
          rewardId,
          pointUsed: reward.costPoint,
          status: RedemptionStatus.REQUESTED,
        },
      });

      // 1.6 บันทึก Transaction การเงิน
      await tx.pointTransaction.create({
        data: {
          memberId,
          type: PointTransactionType.SPEND_REDEMPTION,
          amount: -reward.costPoint,
          balanceAfter: newBalance,
          redemptionId: redemption.id,
          createdBy: memberId,
          detail: `Redeem reward: ${reward.name}`,
        },
      });

      this.logger.log(
        `Member ${memberId} redeemed ${rewardId} (Redemption ID: ${redemption.id})`,
      );

      return {
        redemptionId: redemption.id,
        newBalance,
        status: 'REQUESTED',
      };
    });
  }

  // 2. Approve: แค่เปลี่ยนสถานะ (ของตัดไปแล้ว) ✅
  async approve(redemptionId: string, staffId: string) {
    return this.prisma.$transaction(async (tx) => {
      const redemption = await tx.rewardRedemption.findUnique({
        where: { id: redemptionId },
      });

      if (!redemption) throw new NotFoundException('Redemption not found');

      if (redemption.status !== RedemptionStatus.REQUESTED) {
        throw new BadRequestException(
          `Cannot approve. Current status: ${redemption.status}`,
        );
      }

      // อัปเดตสถานะเป็น COMPLETED จบงาน
      await tx.rewardRedemption.update({
        where: { id: redemptionId },
        data: {
          status: RedemptionStatus.COMPLETED,
          processedBy: staffId,
        },
      });

      this.logger.log(
        `Redemption ${redemptionId} APPROVED by staff ${staffId}`,
      );

      return {
        success: true,
        redemptionId,
        status: 'COMPLETED',
      };
    });
  }

  // 3. Reject: คืนแต้ม + คืนของ ↩️
  // 3. Reject: คืนแต้ม + คืนของ ↩️
  async reject(redemptionId: string, staffId: string) {
    return this.prisma.$transaction(async (tx) => {
      // --- แก้ไขจุดที่ 2: มั่นใจว่าดึง version ของ member มาด้วย ---
      const redemption = await tx.rewardRedemption.findUnique({
        where: { id: redemptionId },
        include: {
          member: {
            select: {
              id: true,
              currentPoints: true,
              version: true, // <--- สำคัญมากสำหรับ Optimistic Lock ตอนคืนแต้ม
            },
          },
        },
      });

      if (!redemption) throw new NotFoundException('Redemption not found');

      if (redemption.status !== RedemptionStatus.REQUESTED) {
        throw new BadRequestException(
          `Cannot reject. Current status: ${redemption.status}`,
        );
      }

      // 3.1 คืนแต้มให้ Member
      const refundPoint = redemption.pointUsed;
      const newBalance = redemption.member.currentPoints + refundPoint;

      // บันทึก Log การคืนเงิน
      await tx.pointTransaction.create({
        data: {
          memberId: redemption.memberId,
          type: PointTransactionType.REFUND_REDEMPTION,
          amount: refundPoint,
          balanceAfter: newBalance,
          redemptionId: redemption.id,
          createdBy: staffId,
          detail: `Refund from rejected redemption #${redemptionId}`,
        },
      });

      try {
        await tx.member.update({
          where: {
            id: redemption.memberId,
            version: redemption.member.version, // ใช้ version ที่ดึงมาเช็ค
          },
          data: {
            currentPoints: newBalance,
            version: { increment: 1 }, // อัปเดต version หนีไปอีก 1 step
          },
        });
      } catch (error) {
        throw new ConflictException('Member data changed during rejection.');
      }

      // --- แก้ไขจุดที่ 3: คืนของเข้า Stock และอัปเดต Version ของ Reward ---
      await tx.reward.update({
        where: { id: redemption.rewardId },
        data: {
          stock: { increment: 1 },
          version: { increment: 1 }, // <--- เพิ่มตรงนี้เพื่อให้ระบบอื่นรู้ว่าข้อมูลเปลี่ยน
        },
      });

      // 3.3 อัปเดตสถานะใบคำขอเป็น REJECTED
      await tx.rewardRedemption.update({
        where: { id: redemptionId },
        data: {
          status: RedemptionStatus.REJECTED,
          processedBy: staffId,
        },
      });

      this.logger.log(
        `Redemption ${redemptionId} REJECTED by staff ${staffId}`,
      );

      return {
        success: true,
        redemptionId,
        status: 'REJECTED',
        refundedPoint: refundPoint,
        newBalance,
      };
    });
  }
}
