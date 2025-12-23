import { Controller, Post, UseGuards } from '@nestjs/common';
import { PointExpirationService } from './point-expiration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '@prisma/client';

@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly expirationService: PointExpirationService) {}

  @UseGuards(RoleGuard(UserRole.SUPER_ADMIN, UserRole.ADMIN))
  @Post('expire-test')
  async runExpire() {
    await this.expirationService.expirePoints();
    return { success: true, message: 'Expiration job triggered manually.' };
  }
}
