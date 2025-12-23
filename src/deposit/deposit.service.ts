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

  async create(data: CreateDepositDto) {
    const member = await this.prisma.member.findUnique({
      where: { id: data.memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${data.memberId} not found`);
    }

    if (member.status === MemberStatus.BANNED) {
      throw new ForbiddenException('Member is banned');
    }

    const wasteTypeIds = data.items.map((item) => item.wasteTypeId);
    const wasteTypes = await this.prisma.wasteType.findMany({
      where: { id: { in: wasteTypeIds } },
    });

    const wasteTypeMap = new Map(wasteTypes.map((wt) => [wt.id, wt]));

    const depositsToCreate = data.items.map((item) => {
      const wasteType = wasteTypeMap.get(item.wasteTypeId);

      if (!wasteType) {
        throw new BadRequestException(
          `Waste type ID ${item.wasteTypeId} not found`,
        );
      }

      if (!wasteType.isActive) {
        throw new BadRequestException(
          `Waste type ${wasteType.name} is not active`,
        );
      }

      const pointEarned = Math.floor(item.amount * Number(wasteType.pointRate));

      return {
        memberId: data.memberId,
        wasteTypeId: item.wasteTypeId,
        amount: item.amount,
        pointEarned: pointEarned,
        status: DepositStatus.PENDING,
      };
    });

    return this.prisma.$transaction(
      depositsToCreate.map((deposit) =>
        this.prisma.deposit.create({ data: deposit }),
      ),
    );
  }

  async completeDeposit(depositId: string, staffId: string) {
    return this.prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.findUnique({
        where: { id: depositId },
        include: {
          member: true,
        },
      });

      if (!deposit) throw new NotFoundException('Deposit not found');

      if (deposit.status === DepositStatus.COMPLETED) {
        throw new BadRequestException('Deposit already completed');
      }

      if (deposit.status !== DepositStatus.PENDING) {
        throw new BadRequestException('Invalid deposit status');
      }

      if (deposit.member.status === MemberStatus.BANNED) {
        throw new ForbiddenException('Member is banned');
      }

      await tx.deposit.update({
        where: { id: deposit.id },
        data: { status: DepositStatus.COMPLETED },
      });

      const newBalance = deposit.member.currentPoints + deposit.pointEarned;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);

      await tx.pointTransaction.create({
        data: {
          memberId: deposit.memberId,
          type: PointTransactionType.EARN_DEPOSIT,
          amount: deposit.pointEarned,
          balanceAfter: newBalance,
          depositId: deposit.id,
          createdBy: staffId,
          expiresAt,
        },
      });

      try {
        await tx.member.update({
          where: {
            id: deposit.memberId,
            version: deposit.member.version,
          },
          data: {
            currentPoints: newBalance,
            version: { increment: 1 },
          },
        });
      } catch (error) {
        throw new ConflictException(
          'Member data was updated by another process. Please try again.',
        );
      }

      return { depositId: deposit.id, newBalance, status: 'COMPLETED' };
    });
  }
}
