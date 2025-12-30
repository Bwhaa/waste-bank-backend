import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException, 
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(memberId: string): Promise<ProfileResponseDto> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน');
    }

    return ProfileResponseDto.fromEntity(member);
  }

  async updateProfile(memberId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    try {
      const updatedMember = await this.prisma.member.update({
        where: { id: memberId },
        data: { ...dto },
      });

      return ProfileResponseDto.fromEntity(updatedMember);

    } catch (error) {
      // จัดการ Error กรณีข้อมูลชนกัน (Unique Constraint)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[])?.join(', ') || 'field';
          throw new ConflictException(`ข้อมูล ${target} นี้มีอยู่ในระบบแล้ว`);
        }
      }
      
      console.error('Profile Update Error:', error);
      throw new InternalServerErrorException('ไม่สามารถอัปเดตข้อมูลโปรไฟล์ได้');
    }
  }
}