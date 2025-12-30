import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // 👈 อย่าลืม import อันนี้

export class LoginLineDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUz...',
    description: 'ID Token จาก LINE Login',
  })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

export class LoginEmailDto {
  @ApiProperty({ example: 'member@recycle.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUz...' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
