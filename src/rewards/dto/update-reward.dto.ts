import { PartialType } from '@nestjs/swagger';
import { CreateRewardDto } from './create-reward.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRewardDto extends PartialType(CreateRewardDto) {
  // เพิ่ม field พิเศษที่ตอนสร้างไม่มี แต่ตอนแก้มีได้
  @ApiPropertyOptional({ example: true, description: 'เปิด/ปิด การมองเห็น' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}