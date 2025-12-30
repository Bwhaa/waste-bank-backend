import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginLineDto, LoginEmailDto, RefreshTokenDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // 👈 import เพิ่ม

@ApiTags('Authentication') // 👈 จัดหมวดหมู่
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('line')
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วย LINE (สำหรับ Member)' })
  @ApiResponse({ status: 200, description: 'Login สำเร็จ ได้รับ Token' })
  @HttpCode(HttpStatus.OK)
  loginWithLine(@Body() dto: LoginLineDto) {
    return this.authService.loginWithLine(dto.idToken);
  }

  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วย Email (สำหรับ Admin/Staff)' })
  @ApiResponse({ status: 200, description: 'Login สำเร็จ' })
  @ApiResponse({ status: 401, description: 'รหัสผ่านผิด' })
  @HttpCode(HttpStatus.OK)
  loginWithEmail(@Body() dto: LoginEmailDto) {
    return this.authService.loginWithEmail(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'ขอ Access Token ใหม่ (Refresh Token)' })
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'ออกจากระบบ (Revoke Token)' })
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
