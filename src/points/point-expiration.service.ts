import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PointTransactionType } from '@prisma/client';

@Injectable()
export class PointExpirationService {
  private readonly logger = new Logger(PointExpirationService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 3 * * *')
  async expirePoints() {
    this.logger.log('Starting point expiration job...');
    const now = new Date();

    let hasMore = true;
    let processedCount = 0;

    while (hasMore) {
      const expiredTransactions = await this.prisma.pointTransaction.findMany({
        where: {
          type: PointTransactionType.EARN_DEPOSIT,
          expiresAt: { lt: now },
          isExpiredProcessed: false,
        },
        take: 100,
        include: { member: true },
      });

      if (expiredTransactions.length === 0) {
        hasMore = false;
        break;
      }

      for (const tx of expiredTransactions) {
        try {
          await this.prisma.$transaction(async (prisma) => {
            const member = await prisma.member.findUnique({
              where: { id: tx.memberId },
              select: { id: true, currentPoints: true, version: true },
            });

            if (!member) {
              await prisma.pointTransaction.update({
                where: { id: tx.id },
                data: { isExpiredProcessed: true },
              });
              return;
            }

            const newBalance = member.currentPoints - tx.amount;

            await prisma.pointTransaction.create({
              data: {
                memberId: member.id,
                type: PointTransactionType.POINT_EXPIRED,
                amount: -tx.amount,
                balanceAfter: newBalance,
                createdBy: 'SYSTEM',
              },
            });

            await prisma.member.update({
              where: { id: member.id, version: member.version },
              data: {
                currentPoints: newBalance,
                version: { increment: 1 },
              },
            });

            await prisma.pointTransaction.update({
              where: { id: tx.id },
              data: { isExpiredProcessed: true },
            });
          });
        } catch (e) {
          this.logger.error(`Failed to expire tx ${tx.id}: ${e.message}`);
        }
      }
      processedCount += expiredTransactions.length;
    }

    this.logger.log(
      `Job finished. Total processed: ${processedCount} transactions.`,
    );
  }
}
