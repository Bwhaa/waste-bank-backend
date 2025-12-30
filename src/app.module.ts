import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DepositModule } from './deposit/deposit.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PointsModule } from './points/points.module';
import { RedeemModule } from './redeem/redeem.module';
import { AuthModule } from './auth/auth.module';
import { WasteTypesModule } from './waste-types/waste-types.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';
import { RewardsModule } from './rewards/rewards.module';

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
    ProfileModule,
    RewardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
