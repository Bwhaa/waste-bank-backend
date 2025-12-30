import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🟢 Public: ดึงข้อมูลสำหรับโชว์หน้าตู้/แอพ (กรองของหมด + กรองที่ปิดทิ้ง)
  async findAllAvailable() {
    return this.prisma.reward.findMany({
      where: {
        isActive: true,
        deletedAt: null, // สำคัญ: ต้องไม่เอาตัวที่ลบแล้วมา
        stock: { gt: 0 }, // optional: ถ้าอยากโชว์ของหมดด้วย (แต่กดแลกไม่ได้) ให้เอาบรรทัดนี้ออก
      },
      orderBy: { costPoint: 'asc' },
      select: { // Select เฉพาะที่จำเป็น (Security Best Practice)
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        costPoint: true,
        stock: true,
      },
    });
  }

  // 🟡 Admin: ดูทั้งหมด เพื่อจัดการสต็อก
  async findAllForAdmin() {
    return this.prisma.reward.findMany({
      where: { deletedAt: null }, // ยังคงไม่เอาตัวที่ลบไปแล้ว
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const reward = await this.prisma.reward.findFirst({
      where: { id, deletedAt: null },
    });
    if (!reward) throw new NotFoundException(`Reward #${id} not found`);
    return reward;
  }

  async create(dto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        ...dto,
        isActive: true,
      },
    });
  }

  async update(id: number, dto: UpdateRewardDto) {
    await this.findOne(id); // เช็คก่อนว่ามีไหม
    return this.prisma.reward.update({
      where: { id },
      data: dto,
    });
  }

  // 🗑️ Soft Delete: แค่แปะวันที่ลบ และปิด Active
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reward.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}