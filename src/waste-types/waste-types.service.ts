import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWasteTypeDto } from './dto/create-waste-type.dto';
import { UpdateWasteTypeDto } from './dto/update-waste-type.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WasteTypesService {
  private readonly logger = new Logger(WasteTypesService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateWasteTypeDto) {
    try {
      // ✅ Mapping เองแบบนี้ปลอดภัยดีครับ กัน field แปลกปลอม
      return await this.prisma.wasteType.create({
        data: {
          name: data.name,
          category: data.category,
          pointRate: data.pointRate,
          unit: data.unit,
          marketPrice: data.marketPrice,
          minAmount: data.minAmount,
          description: data.description,
          imageUrl: data.imageUrl,
          isActive: true, // Default active
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Waste type '${data.name}' already exists.`,
        );
      }

      this.logger.error(
        `Failed to create waste type: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // สำหรับ User ทั่วไป (เห็นแค่ที่ Active)
  async findAll() {
    return this.prisma.wasteType.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  }

  // สำหรับ Admin (เห็นทั้งหมด รวมถึงที่ลบไปแล้ว)
  // 💡 เพิ่ม Method นี้เพื่อให้ Admin บริหารจัดการได้ง่ายขึ้น
  async findAllForAdmin() {
    return this.prisma.wasteType.findMany({
      orderBy: { id: 'asc' },
    });
  }

  // สำหรับ User/Public (ดูได้เฉพาะ Active)
  async findOne(id: number) {
    const wasteType = await this.prisma.wasteType.findUnique({ where: { id } });

    if (!wasteType || !wasteType.isActive) {
      throw new NotFoundException(`Waste type with ID ${id} not found`);
    }
    return wasteType;
  }

  // 🛠️ แก้ไข Logic Update: ให้สามารถแก้ของที่ Inactive ได้ (เพื่อ Re-activate)
  async update(id: number, data: UpdateWasteTypeDto) {
    // 1. เช็คว่ามี ID นี้ใน DB จริงไหม (ไม่สนใจ isActive)
    const existing = await this.prisma.wasteType.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Waste type with ID ${id} not found`);
    }

    // 2. ทำการ Update
    try {
      return await this.prisma.wasteType.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Waste type name already exists.`);
      }
      this.logger.error(`Failed to update waste type ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number) {
    // เช็คก่อนว่ามีของไหม (ใช้ logic เดียวกับ update คือเจอหมด)
    const existing = await this.prisma.wasteType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Waste type #${id} not found`);

    return this.prisma.wasteType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
