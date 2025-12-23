import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginLineDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

export class LoginEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}