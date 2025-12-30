import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'ชื่อจริงต้องมีความยาวระหว่าง 2-50 ตัวอักษร' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'นามสกุลต้องมีความยาวระหว่าง 2-50 ตัวอักษร' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^0\d{9}$/, { message: 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และมี 10 หลัก)' })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(5, 500, { message: 'ที่อยู่ต้องมีความยาวระหว่าง 5-500 ตัวอักษร' })
  address?: string;
}