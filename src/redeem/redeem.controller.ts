import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Import ของใหม่มาตรฐานของเรา
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@ApiTags('Redeems (แลกของรางวัล)')
@Controller('redeems')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) {}

  @Get('admin/pending')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK) // ✅ 200: ดึงข้อมูลสำเร็จ
  @ApiOperation({
    summary: 'ดูรายการคำขอแลกของรางวัลที่รออนุมัติ (Staff/Admin)',
  })
  async getPending() {
    return this.redeemService.findAllPending();
  }

  @Post(':rewardId')
  @Roles(UserRole.MEMBER)
  @HttpCode(HttpStatus.CREATED) // ✅ 201: สร้างคำขอใหม่สำเร็จ
  @ApiOperation({ summary: 'สมาชิกกดแลกของรางวัล (ตัดแต้มทันที)' })
  async redeem(
    @Param('rewardId', ParseIntPipe) rewardId: number,
    @CurrentUser() user: { id: string },
  ) {
    return this.redeemService.redeem(user.id, rewardId);
  }

  @Patch(':id/approve')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK) // ✅ 200: อัปเดตสถานะสำเร็จ
  @ApiOperation({ summary: 'อนุมัติการแลก (ส่งของแล้ว) - Staff Only' })
  async approve(
    @Param('id', ParseUUIDPipe) redemptionId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.redeemService.approve(redemptionId, user.id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK) // ✅ 200: ปฏิเสธและคืนแต้มสำเร็จ
  @ApiOperation({ summary: 'ปฏิเสธการแลก (คืนแต้มให้ลูกค้า) - Staff Only' })
  async reject(
    @Param('id', ParseUUIDPipe) redemptionId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.redeemService.reject(redemptionId, user.id);
  }
}
