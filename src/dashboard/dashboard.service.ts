import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositStatus, RedemptionStatus, UserRole } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminStats() {
    // 1. 👥 สมาชิกทั้งหมด (KPI ข้อ 12)
    const totalMembers = await this.prisma.member.count({
      where: { role: UserRole.MEMBER },
    });

    // 2. ♻️ ขยะที่รับฝากทั้งหมด (kg) (KPI ข้อ 12)
    const totalWaste = await this.prisma.deposit.aggregate({
      where: { status: DepositStatus.COMPLETED },
      _sum: { amount: true },
    });

    // 3. 💰 แต้มที่หมุนเวียนในระบบ (จ่ายออกไป - แลกคืนกลับมา)
    const totalPointsGiven = await this.prisma.pointTransaction.aggregate({
      where: { type: 'EARN_DEPOSIT' },
      _sum: { amount: true },
    });

    const totalRedeemed = await this.prisma.rewardRedemption.count({
      where: { status: RedemptionStatus.COMPLETED },
    });

    return {
      cards: {
        totalMembers,
        totalWasteKg: totalWaste._sum.amount || 0,
        totalPointsIssued: totalPointsGiven._sum.amount || 0,
        totalRedeemedCount: totalRedeemed,
      },
    };
  }

  // 📊 กราฟประเภทขยะยอดฮิต (BRD ข้อ 9)
  async getWasteTypeChart() {
    const stats = await this.prisma.deposit.groupBy({
      by: ['wasteTypeId'],
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: 'desc' },
      },
    });

    // Join เอาชื่อประเภทขยะมาใส่ (Prisma groupBy ไม่ support include)
    const wasteTypes = await this.prisma.wasteType.findMany();
    const typeMap = new Map(wasteTypes.map((w) => [w.id, w.name]));

    return stats.map((s) => ({
      name: typeMap.get(s.wasteTypeId) || 'Unknown',
      value: s._sum.amount || 0,
    }));
  }
}
