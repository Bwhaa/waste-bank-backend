import { Module } from '@nestjs/common';
import { PointExpirationService } from './point-expiration.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PointsController } from './points.controller';

@Module({
  imports: [PrismaModule],
  providers: [PointExpirationService],
  controllers: [PointsController],
})
export class PointsModule {}
