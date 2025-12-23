import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { User } from '../common/decorators/user.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

interface UserPayload {
  id: string;
  role: UserRole;
}

@ApiTags('Deposits (ฝากขยะ)')
@Controller('deposits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'สร้างรายการฝากขยะใหม่ (Staff Only)' })
  @ApiBody({ type: CreateDepositDto })
  @ApiResponse({
    status: 201,
    description: 'สร้างรายการสำเร็จ (สถานะเป็น PENDING)',
  })
  @ApiResponse({
    status: 400,
    description: 'ข้อมูลไม่ถูกต้อง (เช่น รหัสขยะผิด, น้ำหนักติดลบ)',
  })
  @ApiResponse({ status: 404, description: 'ไม่พบสมาชิก (Member Not Found)' })
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }

  @Patch(':id/complete')
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  @ApiOperation({ summary: 'ยืนยันการฝากและคำนวณแต้ม (Staff Only)' })
  @ApiResponse({ status: 200, description: 'ทำรายการสำเร็จ ได้รับแต้มแล้ว' })
  @ApiResponse({
    status: 400,
    description: 'สถานะไม่ถูกต้อง หรือทำรายการไปแล้ว',
  })
  @ApiResponse({ status: 403, description: 'สมาชิกถูกแบน' })
  complete(@Param('id', ParseUUIDPipe) id: string, @User() user: UserPayload) {
    return this.depositService.completeDeposit(id, user.id);
  }
}
