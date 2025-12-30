import { Module } from '@nestjs/common';
import { PointExpirationService } from './point-expiration.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  imports: [PrismaModule],
  providers: [PointExpirationService, PointsService],
  controllers: [PointsController],
})
export class PointsModule {}
