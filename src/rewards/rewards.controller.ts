import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Rewards (คลังของรางวัล Master Data)')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // 🌍 Public Zone (ใครก็ดูได้ หรือจะบังคับ Login ก็ได้แล้วแต่ Requirement)
  @Get()
  @ApiOperation({ summary: 'ดูรายการของรางวัลที่พร้อมแลก (สำหรับ User)' })
  findAllPublic() {
    return this.rewardsService.findAllAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูรายละเอียดของรางวัลรายชิ้น' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rewardsService.findOne(id);
  }

  // 🔒 Admin Zone (จัดการของ)
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูรายการทั้งหมดรวมของหมด/ปิด (Staff/Admin)' })
  findAllAdmin() {
    return this.rewardsService.findAllForAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // ให้ Admin สร้างคนเดียว หรือเพิ่ม Staff ก็ได้
  @ApiBearerAuth()
  @ApiOperation({ summary: 'เพิ่มของรางวัลใหม่' })
  create(@Body() dto: CreateRewardDto) {
    return this.rewardsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF) // Staff ช่วยเติมของได้
  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้ไขของรางวัล (เติมสต็อก/แก้ราคา)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRewardDto) {
    return this.rewardsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบของรางวัล (Soft Delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rewardsService.remove(id);
  }
}
