import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { WasteTypesService } from './waste-types.service';
import { CreateWasteTypeDto } from './dto/create-waste-type.dto';
import { UpdateWasteTypeDto } from './dto/update-waste-type.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { WasteType, UserRole } from '@prisma/client';

// 👇 1. Import ของใหม่ (ลบ RoleGuard ตัวเก่าทิ้ง)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator'; // 👈 ใช้ Decorator

@ApiTags('Waste Types (ราคารับซื้อขยะ)')
@Controller('waste-types')
export class WasteTypesController {
  constructor(private readonly wasteTypesService: WasteTypesService) {}

  // ---------------------------------------------------
  // 🔓 Public Zone (ดูได้ทุกคน)
  // ---------------------------------------------------

  @Get()
  @ApiOperation({ summary: 'ดึงรายการขยะทั้งหมด (เฉพาะที่ Active)' })
  async findAll(): Promise<WasteType[]> {
    return this.wasteTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูรายละเอียดขยะตาม ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<WasteType> {
    return this.wasteTypesService.findOne(id);
  }

  // ---------------------------------------------------
  // 🔒 Admin Zone (ต้อง Login + Admin)
  // ---------------------------------------------------

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ 2. ใช้ Guard คู่หู
  @Roles(UserRole.ADMIN) // 🏷️ 3. ระบุ Role
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดึงรายการทั้งหมดรวมที่ปิดใช้งาน (Admin Only)' })
  async findAllForAdmin(): Promise<WasteType[]> {
    return this.wasteTypesService.findAllForAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'สร้างประเภทขยะใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ' })
  async create(@Body() dto: CreateWasteTypeDto): Promise<WasteType> {
    return this.wasteTypesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้ไขราคา/ข้อมูลขยะ' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWasteTypeDto,
  ): Promise<WasteType> {
    return this.wasteTypesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบประเภทขยะ (Soft Delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<WasteType> {
    return this.wasteTypesService.remove(id);
  }
}
