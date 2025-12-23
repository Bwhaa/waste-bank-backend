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

  async redeem(memberId: string, rewardId: number) {
    return this.prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUnique({
        where: { id: rewardId },
      });

      if (!reward || !reward.isActive) {
        throw new BadRequestException('Reward not available');
      }
      if (reward.stock <= 0) {
        throw new BadRequestException('Reward is out of stock');
      }

      const member = await tx.member.findUnique({
        where: { id: memberId },
        select: {
          id: true,
          currentPoints: true,
          version: true,
          status: true,
        },
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

      const redemption = await tx.rewardRedemption.create({
        data: {
          memberId,
          rewardId,
          pointUsed: reward.costPoint,
          status: RedemptionStatus.REQUESTED,
        },
      });

      const newBalance = member.currentPoints - reward.costPoint;

      await tx.pointTransaction.create({
        data: {
          memberId,
          type: PointTransactionType.SPEND_REDEMPTION,
          amount: -reward.costPoint,
          balanceAfter: newBalance,
          redemptionId: redemption.id,
          createdBy: memberId,
        },
      });

      try {
        await tx.member.update({
          where: {
            id: memberId,
            version: member.version,
          },
          data: {
            currentPoints: newBalance,
            version: { increment: 1 },
          },
        });
      } catch (error) {
        this.logger.error(
          `Conflict redeeming reward ${rewardId} for member ${memberId}`,
        );
        throw new ConflictException('Transaction conflict. Please try again.');
      }

      this.logger.log(
        `Member ${memberId} requested reward ${rewardId} (Redemption ID: ${redemption.id})`,
      );

      return {
        redemptionId: redemption.id,
        newBalance,
        status: 'REQUESTED',
      };
    });
  }

  async approve(redemptionId: string, staffId: string) {
    return this.prisma.$transaction(async (tx) => {
      const redemption = await tx.rewardRedemption.findUnique({
        where: { id: redemptionId },
        include: {
          reward: {
            select: { id: true, stock: true, version: true, name: true },
          },
        },
      });

      if (!redemption) throw new NotFoundException('Redemption not found');

      if (redemption.status !== RedemptionStatus.REQUESTED) {
        throw new BadRequestException(
          `Cannot approve. Current status: ${redemption.status}`,
        );
      }

      if (redemption.reward.stock <= 0) {
        throw new BadRequestException(
          `Reward '${redemption.reward.name}' is out of stock.`,
        );
      }

      try {
        await tx.reward.update({
          where: {
            id: redemption.reward.id,
            version: redemption.reward.version,
          },
          data: {
            stock: { decrement: 1 },
            version: { increment: 1 },
          },
        });
      } catch (error) {
        throw new ConflictException('Reward stock updated by another process.');
      }

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

  async reject(redemptionId: string, staffId: string) {
    return this.prisma.$transaction(async (tx) => {
      const redemption = await tx.rewardRedemption.findUnique({
        where: { id: redemptionId },
        include: {
          member: {
            select: { id: true, currentPoints: true, version: true },
          },
        },
      });

      if (!redemption) throw new NotFoundException('Redemption not found');

      if (redemption.status !== RedemptionStatus.REQUESTED) {
        throw new BadRequestException(
          `Cannot reject. Current status: ${redemption.status}`,
        );
      }

      const refundPoint = redemption.pointUsed;
      const newBalance = redemption.member.currentPoints + refundPoint;

      await tx.pointTransaction.create({
        data: {
          memberId: redemption.memberId,
          type: PointTransactionType.REFUND_REDEMPTION,
          amount: refundPoint,
          balanceAfter: newBalance,
          redemptionId: redemption.id,
          createdBy: staffId,
        },
      });

      try {
        await tx.member.update({
          where: {
            id: redemption.memberId,
            version: redemption.member.version,
          },
          data: {
            currentPoints: newBalance,
            version: { increment: 1 },
          },
        });
      } catch (error) {
        throw new ConflictException('Member data changed during rejection.');
      }

      await tx.rewardRedemption.update({
        where: { id: redemptionId },
        data: {
          status: RedemptionStatus.REJECTED,
          processedBy: staffId,
        },
      });

      this.logger.log(
        `Redemption ${redemptionId} REJECTED by staff ${staffId} (Refunded ${refundPoint} points)`,
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
