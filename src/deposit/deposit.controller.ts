import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
// ❌ ไม่ต้องใช้ CurrentUser แล้ว เพราะเราไม่ได้ส่ง user.id เข้า Service

@ApiTags('Deposits (ฝากขยะ)')
@Controller('deposits')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // ✅ เพิ่ม UserRole.MEMBER ด้วย เผื่อกรณี User Login ที่หน้าตู้เอง
  @Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.MEMBER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'รับฝากขยะจากตู้ Kiosk (One-Stop Service)',
    description:
      'บันทึกข้อมูลขยะ + คำนวณแต้ม + อัปเดตยอดเงินสมาชิก (รองรับ Kiosk Mode)',
  })
  @ApiBody({ type: CreateDepositDto })
  @ApiResponse({
    status: 201,
    description: 'ทำรายการสำเร็จ (ได้รับแต้มทันที)',
  })
  @ApiResponse({
    status: 400,
    description: 'ข้อมูลไม่ถูกต้อง (เช่น รหัสขยะผิด, ขยะประเภทนี้ปิดรับ)',
  })
  @ApiResponse({ status: 404, description: 'ไม่พบสมาชิก (Member Not Found)' })
  @ApiResponse({
    status: 201,
    description: 'ทำรายการสำเร็จ (ได้รับแต้มทันที)',
    schema: {
      example: {
        success: true,
        memberId: 'uuid-123',
        memberName: 'สมชาย รักสะอาด',
        earnedPoints: 50,
        newBalance: 1050,
        itemsCount: 2,
      },
    },
  })
  async create(
    @Body() createDepositDto: CreateDepositDto,
    // ❌ เอา @CurrentUser ออกเลยครับ ไม่ได้ใช้แล้ว
  ) {
    // ✅ เรียก Service โดยส่งแค่ DTO ตัวเดียว (ตามที่เราแก้ Service ไป)
    return this.depositService.createDeposit(createDepositDto);
  }
  @Get('stats/me')
  @UseGuards(JwtAuthGuard) // User ต้อง Login ก่อนถึงจะดูของตัวเองได้
  @ApiBearerAuth()
  @ApiOperation({ summary: '📊 ดูสถิติการช่วยโลกของฉัน (Dashboard)' })
  @ApiResponse({
    status: 200,
    description: 'ส่งข้อมูลสรุปยอดรวมและแยกประเภทขยะ',
  })
  async getMyStats(@Request() req) {
    // req.user.id มาจาก JWT Token
    return this.depositService.getMyStats(req.user.id);
  }
}
