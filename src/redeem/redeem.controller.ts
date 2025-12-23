import {
  Controller,
  Post,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { User } from '../common/decorators/user.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface UserPayload {
  id: string;
  role: UserRole;
}

@ApiTags('Redeems (แลกของรางวัล)')
@Controller('redeems')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) {}

  @Post(':rewardId')
  @UseGuards(RoleGuard(UserRole.MEMBER)) // เฉพาะ Member แลกได้
  @ApiOperation({ summary: 'สมาชิกกดแลกของรางวัล (ตัดแต้มทันที)' })
  @ApiResponse({
    status: 201,
    description: 'สร้างรายการแลกสำเร็จ (สถานะ REQUESTED)',
  })
  @ApiResponse({ status: 400, description: 'แต้มไม่พอ หรือของหมด' })
  redeem(
    @Param('rewardId', ParseIntPipe) rewardId: number,
    @User() user: UserPayload,
  ) {
    return this.redeemService.redeem(user.id, rewardId);
  }

  @Patch(':id/approve')
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  @ApiOperation({ summary: 'อนุมัติการแลก (ตัด Stock) - Staff Only' })
  @ApiResponse({ status: 200, description: 'อนุมัติสำเร็จ' })
  @ApiResponse({
    status: 400,
    description: 'สถานะไม่ถูกต้อง หรือของหมดระหว่างรอ',
  })
  approve(
    @Param('id', ParseUUIDPipe) redemptionId: string,
    @User() user: UserPayload,
  ) {
    return this.redeemService.approve(redemptionId, user.id);
  }

  @Patch(':id/reject')
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  @ApiOperation({ summary: 'ปฏิเสธการแลก (คืนแต้มให้ลูกค้า) - Staff Only' })
  @ApiResponse({ status: 200, description: 'ปฏิเสธและคืนแต้มสำเร็จ' })
  reject(
    @Param('id', ParseUUIDPipe) redemptionId: string,
    @User() user: UserPayload,
  ) {
    return this.redeemService.reject(redemptionId, user.id);
  }
}
