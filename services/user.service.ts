// frontend/services/user.service.ts

import { api } from '@/lib/api'; // ✅ ใช้ api กลาง

// Interface นี้อ้างอิงจากไฟล์ที่คุณส่งมา (น่าจะตรงกับ Backend)
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  pointBalance: number;  // สังเกตว่า Backend ใช้ pointBalance
  monthlyPoints: number;
  pictureUrl?: string;   // เพิ่มเผื่อไว้สำหรับรูป Profile Line
  displayName?: string;  // เพิ่มเผื่อไว้
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export const UserService = {
  // ✅ ดึงข้อมูล Profile (GET /api/members/me)
  getProfile: async (): Promise<UserProfile> => {
    return api.get('/api/members/me');
  },

  // ✅ อัปเดตข้อมูล (PATCH /api/members/me)
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    return api.patch('/api/members/me', data); // ใช้ api.patch (ต้องเพิ่มใน api.ts ถ้ายังไม่มี) หรือใช้ api.post ถ้าระบบบังคับ
  }
};