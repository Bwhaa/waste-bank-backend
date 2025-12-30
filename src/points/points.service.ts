import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔍 ดูประวัติของฉัน (User)
  async findMyTransactions(memberId: string) {
    return this.prisma.pointTransaction.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' }, // เรียงใหม่ -> เก่า
      include: {
        // ✅ Join 1: ดึงข้อมูลการฝาก พร้อมชื่อประเภทขยะ
        deposit: {
          select: {
            amount: true,
            wasteType: {
              select: { name: true, unit: true },
            },
          },
        },
        // ✅ Join 2: ดึงข้อมูลการแลก พร้อมชื่อของรางวัล
        redemption: {
          select: {
            pointUsed: true,
            reward: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  // 👮‍♂️ ดูประวัติทั้งหมด (Admin Only)
  async findAllTransactions() {
    return this.prisma.pointTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        member: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        deposit: { include: { wasteType: true } },
        redemption: { include: { reward: true } },
      },
      take: 100, // Limit ไว้หน่อย เดี๋ยว Server บึ้มถ้าข้อมูลเยอะ
    });
  }
}
