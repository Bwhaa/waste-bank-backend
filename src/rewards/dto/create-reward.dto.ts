import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ example: 'บัตร Starbuck 100 บาท', description: 'ชื่อของรางวัล' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'ใช้ได้ทุกสาขา', description: 'รายละเอียด' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://img.url/coffe.jpg', description: 'รูปภาพ' })
  @IsOptional()
  @IsString() // ถ้าซีเรียสเรื่อง URL ให้ใช้ @IsUrl()
  imageUrl?: string;

  @ApiProperty({ example: 500, description: 'แต้มที่ใช้แลก (ห้ามต่ำกว่า 1)' })
  @IsInt()
  @Min(1)
  costPoint: number;

  @ApiProperty({ example: 50, description: 'จำนวนสินค้าในสต็อก' })
  @IsInt()
  @Min(0)
  stock: number;
}