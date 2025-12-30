import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service'; // 👈 inject prisma
import { MemberStatus } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) { // 👈 inject prisma
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    });
  }

  async validate(payload: JwtPayload) {
    // 🔍 เช็ค DB เพื่อความชัวร์ 100%
    const user = await this.prisma.member.findUnique({
      where: { id: payload.sub },
    });

    // ถ้าไม่เจอ User หรือ โดนแบน หรือ ไม่ Active -> ดีดออกทันที
    if (!user || user.status === MemberStatus.BANNED || !user.isActive) {
      throw new UnauthorizedException('Access denied');
    }

    // ✅ return ตัว user ล่าสุดจาก DB
    return {
      id: user.id,
      role: user.role, // ใช้ Role ล่าสุดจาก DB เสมอ
      email: user.email 
    };
  }
}