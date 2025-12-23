import { UserRole } from '@prisma/client';
import { RolesGuard } from './roles.guard';

export const RoleGuard = (...roles: UserRole[]) => new RolesGuard(roles);
