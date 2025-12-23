import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WasteCategory, MeasureUnit } from '@prisma/client';

export class CreateWasteTypeDto {
  @ApiProperty({ example: 'ขวดพลาสติกใส (PET)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: WasteCategory,
    example: WasteCategory.PLASTIC,
    description: 'ประเภทหลัก เช่น พลาสติก, แก้ว, กระดาษ',
  })
  @IsEnum(WasteCategory)
  category: WasteCategory;

  @ApiPropertyOptional({
    example: 'ต้องล้างสะอาดและแกะฉลากออก',
    description: 'เงื่อนไขการรับฝาก',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/pet-bottle.png',
    description: 'URL รูปภาพสำหรับแสดงผล',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 10.5, description: 'ราคารับซื้อ (ให้แต้มลูกค้า)' })
  @IsNumber()
  @Min(0)
  pointRate: number;

  @ApiPropertyOptional({
    example: 12.0,
    description: 'ราคาตลาด (ที่เราเอาไปขายต่อ) - ใช้คำนวณกำไร',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  marketPrice?: number;

  @ApiProperty({
    enum: MeasureUnit,
    example: MeasureUnit.KG,
    default: MeasureUnit.KG,
    description: 'หน่วยนับ (กิโลกรัม, ชิ้น, ฯลฯ)',
  })
  @IsOptional()
  @IsEnum(MeasureUnit)
  unit?: MeasureUnit;

  @ApiPropertyOptional({
    example: 0.5,
    description: 'จำนวนขั้นต่ำที่รับฝาก',
    default: 0.1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;
}
