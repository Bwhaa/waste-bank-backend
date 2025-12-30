import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // ปรับ path เป็น relative
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { CurrentUser } from 'src/auth/current-user.decorator'; // เช็ค path ให้ตรงกับที่สร้างจริง
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Profile (ข้อมูลส่วนตัว)')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth() // 🔐 บอก Swagger ว่าต้องใส่ Token
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ดูข้อมูลส่วนตัวของฉัน' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getMyProfile(
    @CurrentUser() user: { id: string },
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfile(user.id);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'แก้ไขข้อมูลส่วนตัว (ชื่อ, เบอร์โทร)' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateMyProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateProfile(user.id, dto);
  }
}
