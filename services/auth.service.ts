// frontend/services/auth.service.ts

import { api } from '@/lib/api'; // ✅ ใช้ api กลาง
import { LoginResponse } from '@/types'; // (ถ้ามี type นี้อยู่แล้ว)
import { jwtDecode } from 'jwt-decode';

// Type สำหรับ Payload ใน Token (ปรับตามจริง)
interface UserTokenPayload {
  sub: string;
  iat: number;
  exp: number;
  role?: string;
}

const TOKEN_KEY = 'token'; // Key สำหรับเก็บใน LocalStorage

export const AuthService = {
  /**
   * 1. Login ผ่าน LINE
   * รับ accessToken จาก LIFF แล้วส่งไปหลังบ้าน
   */
  loginWithLine: async (accessToken: string) => {
    try {
      // ยิงไปที่ POST /api/auth/line ตาม Swagger
      const response = await api.post('/api/auth/line', { accessToken });

      if (response.accessToken) {
        AuthService.setSession(response.accessToken);
      }

      return response;
    } catch (error) {
      console.error('Line Login Failed:', error);
      throw error;
    }
  },

  /**
   * 2. Login ปกติ (ถ้ามี)
   */
  login: async (credentials: any) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.accessToken) {
        AuthService.setSession(response.accessToken);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 3. จัดการ Session (เก็บ Token ลง LocalStorage)
   * เปลี่ยนจาก Cookie มาใช้ LocalStorage เพื่อให้ match กับ lib/api.ts
   */
  setSession: (accessToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
  },

  /**
   * 4. Logout
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      // api.post('/api/auth/logout', {}); // ถ้ายิง API logout ด้วย
      window.location.href = '/login'; // หรือ reload หน้า
    }
  },

  /**
   * 5. ดึง Token
   */
  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * 6. เช็คสถานะ Login
   */
  isAuthenticated: (): boolean => {
    return !!AuthService.getAccessToken();
  },

  /**
   * 7. แกะข้อมูลจาก Token (Optional)
   */
  getUserFromToken: (): UserTokenPayload | null => {
    const token = AuthService.getAccessToken();
    if (!token) return null;
    try {
      return jwtDecode<UserTokenPayload>(token);
    } catch (error) {
      return null;
    }
  }
};