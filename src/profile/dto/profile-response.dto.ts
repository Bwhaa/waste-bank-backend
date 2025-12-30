import { Member, UserRole, MemberStatus } from '@prisma/client';

export class ProfileResponseDto {
  id: string;
  lineId: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  role: UserRole;
  status: MemberStatus;
  currentPoints: number;
  qrCode: string | null;

  static fromEntity(member: Member): ProfileResponseDto {
    const response = new ProfileResponseDto();
    response.id = member.id;
    response.lineId = member.lineId;
    response.firstName = member.firstName;
    response.lastName = member.lastName;
    response.phoneNumber = member.phoneNumber;
    response.email = member.email;
    response.address = member.address;
    response.role = member.role;
    response.status = member.status;
    response.currentPoints = member.currentPoints;
    response.qrCode = member.qrCode;

    return response;
  }
}
