import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // 👈 Inject Reflector ได้แล้ว!

  canActivate(context: ExecutionContext): boolean {
    // 1. อ่าน Role ที่ต้องการจาก Decorator (@Roles)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // ถ้าไม่ได้ระบุ Role แปลว่าใครก็เข้าได้ (ข้ามไปเลย)
    if (!requiredRoles) {
      return true;
    }

    // 2. ดึง User จาก Request (ที่ผ่าน JwtAuthGuard มาแล้ว)
    const { user } = context.switchToHttp().getRequest();

    // 3. เช็คว่ามี User ไหม และ Role ตรงไหม
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('สิทธิ์การใช้งานไม่เพียงพอ (Access Denied)');
    }

    return true;
  }
}
