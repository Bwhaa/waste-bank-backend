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

  async findAll() {
    return this.prisma.wasteType.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const wasteType = await this.prisma.wasteType.findUnique({ where: { id } });

    if (!wasteType || !wasteType.isActive) {
      throw new NotFoundException(`Waste type with ID ${id} not found`);
    }
    return wasteType;
  }

  async update(id: number, data: UpdateWasteTypeDto) {
    await this.findOne(id);

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
    await this.findOne(id);

    return this.prisma.wasteType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
