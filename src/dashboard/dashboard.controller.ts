import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Dashboard (สถิติภาพรวม)')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/overview')
  @Roles(UserRole.ADMIN, UserRole.STAFF) // Staff ก็ควรดูได้
  @ApiOperation({ summary: 'ดูภาพรวมระบบ (Cards)' })
  async getAdminOverview() {
    return this.dashboardService.getAdminStats();
  }

  @Get('admin/chart/waste')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'ดึงข้อมูลกราฟแยกประเภทขยะ (Pie Chart)' })
  async getWasteChart() {
    return this.dashboardService.getWasteTypeChart();
  }
}
