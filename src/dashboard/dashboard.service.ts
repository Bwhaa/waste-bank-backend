import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositStatus, MemberStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const totalWaste = await this.prisma.deposit.aggregate({
      where: { status: DepositStatus.COMPLETED },
      _sum: { amount: true },
    });

    const totalPointsGiven = await this.prisma.deposit.aggregate({
      where: { status: DepositStatus.COMPLETED },
      _sum: { pointEarned: true },
    });

    const totalMembers = await this.prisma.member.count();
    const activeMembers = await this.prisma.member.count({
      where: { status: MemberStatus.ACTIVE },
    });

    const wasteByTypes = await this.prisma.deposit.groupBy({
      by: ['wasteTypeId'],
      where: { status: DepositStatus.COMPLETED },
      _sum: { amount: true },
    });

    const enrichedWasteTypes = await Promise.all(
      wasteByTypes.map(async (item) => {
        const type = await this.prisma.wasteType.findUnique({
          where: { id: item.wasteTypeId },
        });
        return {
          name: type?.name || 'Unknown',
          amount: item._sum.amount || 0,
        };
      }),
    );

    return {
      summary: {
        totalWeight: totalWaste._sum.amount || 0,
        totalPoints: totalPointsGiven._sum.pointEarned || 0,
        totalMembers,
        activeMembers,
      },
      wasteChart: enrichedWasteTypes,
    };
  }
}
