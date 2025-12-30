import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LineService } from './line/line.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserRole, MemberStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly lineService: LineService,
  ) {}

  async loginWithLine(idToken: string) {
    const profile = await this.lineService.verifyIdToken(idToken);

    let member = await this.prisma.member.findUnique({
      where: { lineId: profile.sub },
    });

    if (!member) {
      member = await this.prisma.member.create({
        data: {
          lineId: profile.sub,
          firstName: (profile.name ?? 'LINE User').split(' ')[0],
          lastName:
            (profile.name ?? 'LINE User').split(' ').slice(1).join(' ') || '-',
          qrCode: uuid(),
          role: UserRole.MEMBER,
          status: MemberStatus.ACTIVE,
        },
      });
    }

    if (member.status === MemberStatus.BANNED) {
      throw new ForbiddenException('Account is banned');
    }
    if (!member.isActive) {
      throw new ForbiddenException('Account is disabled');
    }

    return this.generateTokens(member.id, member.role);
  }

  async loginWithEmail(email: string, pass: string) {
    const member = await this.prisma.member.findUnique({
      where: { email },
    });

    if (!member || !member.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 1. เช็ครหัสผ่าน
    const isMatch = await bcrypt.compare(pass, member.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. เช็คสถานะแบน
    if (member.status === MemberStatus.BANNED) {
      throw new ForbiddenException('Account is banned');
    }

    // ➕ 3. เพิ่มเช็ค Soft Delete (เผื่อ Staff คนนี้ลาออกแล้วเราปิด Account ไป)
    if (!member.isActive) {
      throw new ForbiddenException('Account is disabled');
    }

    return this.generateTokens(member.id, member.role);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.decode(refreshToken) as any;
      if (!payload?.sub) throw new Error();

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { member: true },
      });

      if (!storedToken) throw new UnauthorizedException('Invalid token');

      if (storedToken.isRevoked) {
        await this.prisma.refreshToken.updateMany({
          where: { memberId: payload.sub },
          data: { isRevoked: true },
        });
        throw new ForbiddenException('Token reuse detected. Access denied.');
      }

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      return this.generateTokens(
        storedToken.memberId,
        storedToken.member.role,
        storedToken.id,
      );
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken
      .update({
        where: { token: refreshToken },
        data: { isRevoked: true },
      })
      .catch(() => null);

    return { success: true };
  }

  private async generateTokens(
    userId: string,
    role: string,
    oldTokenId?: string,
  ) {
    const payload = { sub: userId, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.$transaction(async (tx) => {
      if (oldTokenId) {
        await tx.refreshToken.update({
          where: { id: oldTokenId },
          data: { isRevoked: true, token: `REVOKED_${uuid()}` },
        });
      }
      await tx.refreshToken.create({
        data: {
          token: refreshToken,
          memberId: userId,
          expiresAt,
        },
      });
    });

    return { accessToken, refreshToken };
  }
}
