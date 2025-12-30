import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class DepositItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID ของประเภทขยะ (WasteType ID)',
  })
  @IsNumber()
  @Min(1)
  wasteTypeId: number;

  @ApiProperty({
    example: 5.5,
    description: 'น้ำหนัก (KG) หรือปริมาณที่รับฝาก',
  })
  @IsNumber()
  @Min(0.1, { message: 'จำนวนต้องมากกว่า 0.1' })
  amount: number;
}

export class CreateDepositDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID ของสมาชิก (Member) ที่เอาขยะมาฝาก',
  })
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    type: [DepositItemDto],
    description: 'รายการขยะที่นำมาฝาก (ต้องมีอย่างน้อย 1 รายการ)',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'ต้องระบุรายการขยะอย่างน้อย 1 รายการ' })
  @ValidateNested({ each: true })
  @Type(() => DepositItemDto)
  items: DepositItemDto[];
}
