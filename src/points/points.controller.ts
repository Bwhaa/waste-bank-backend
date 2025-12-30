import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { PointExpirationService } from './point-expiration.service';
import { PointsService } from './points.service'; // 👈 Import
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // แก้ path ตามจริงของคุณ
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Points (ระบบจัดการแต้ม)')
@Controller('points')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PointsController {
  constructor(
    private readonly expirationService: PointExpirationService,
    private readonly pointsService: PointsService, // 👈 Inject เข้ามาเพิ่ม
  ) {}

  // --- 👇 ส่วนใหม่ที่เพิ่มเข้ามา (User & Admin View) 👇 ---

  @Get('transactions/me')
  @ApiOperation({ summary: '📜 ดูประวัติแต้มของฉัน (My History)' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  async getMyHistory(@Request() req) {
    // req.user.id มาจาก JWT Token
    return this.pointsService.findMyTransactions(req.user.id);
  }

  @Get('transactions/all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '👮‍♂️ ดูประวัติแต้มทั้งหมด (Admin View)' })
  async getAllHistory() {
    return this.pointsService.findAllTransactions();
  }

  // --- 👆 จบส่วนใหม่ 👆 ---

  // --- ส่วนเดิมของคุณ (Expire Test) ---
  @Post('expire-test')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({
    summary: 'รันระบบตัดแต้มหมดอายุ (Manual Trigger)',
    description: 'ใช้สำหรับทดสอบ หรือสั่งตัดแต้มทันทีโดยไม่ต้องรอ Cron Job',
  })
  async runExpire() {
    const result = await this.expirationService.expirePoints();
    return {
      success: true,
      message: 'Expiration job triggered manually.',
      details: result,
    };
  }
}
