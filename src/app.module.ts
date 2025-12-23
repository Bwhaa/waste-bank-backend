import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DepositModule } from './deposit/deposit.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PointsModule } from './points/points.module';
import { RedeemModule } from './redeem/redeem.module';
import { AuthModule } from './auth/auth.module';
import { WasteCategory } from '@prisma/client';
import { WasteTypesModule } from './waste-types/waste-types.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    DepositModule,
    PointsModule,
    RedeemModule,
    AuthModule,
    WasteTypesModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
