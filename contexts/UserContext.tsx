// frontend/contexts/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service'; // ✅ 1. Import authService

// URL ของ Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

interface UserContextType {
  user: UserProfile;
  isLoading: boolean;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: '',
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูล Profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // ✅ 2. แก้จุดนี้: ใช้ authService ดึง Token (แทน localStorage)
      const token = authService.getAccessToken(); 
      
      if (!token) {
        console.warn('ไม่พบ Token ใน Cookie');
        setIsLoading(false);
        return;
      }

      // ยิง API ไปที่ Backend
      const res = await fetch(`${API_URL}/members/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // แนบ Token ไปด้วย
          'Content-Type': 'application/json',
        },
      });

      // ✅ แก้เป็นแบบนี้ครับ:
if (!res.ok) {
  const errorText = await res.text(); // อ่านข้อความที่ Backend ด่ากลับมา
  console.error('🔥 API Error Status:', res.status);
  console.error('🔥 API Error Message:', errorText);
  
  if (res.status === 401) {
     // ถ้า 401 แปลว่า Token เน่า -> ลบ Token ทิ้งแล้วให้ Login ใหม่
     // authService.logout(); (ถ้า import มาใช้)
     throw new Error('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
  }
  
  throw new Error(`Server Error (${res.status}): ${errorText}`);
}
      const data = await res.json();

      // อัปเดต State (รวม firstName + lastName เป็น name เดียว)
      setUser({
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        phone: data.phone || '',
        address: data.address || '',
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลครั้งแรกเมื่อเข้าเว็บ
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ฟังก์ชันอัปเดตข้อมูล (Patch)
  const updateUser = async (data: Partial<UserProfile>) => {
    try {
      // ✅ 3. แก้จุดนี้ด้วย: ใช้ authService ดึง Token
      const token = authService.getAccessToken();
      if (!token) return;

      const payload: any = {
        address: data.address,
        phone: data.phone,
      };

      // ถ้ามีการแก้ชื่อ ต้องแยกกลับเป็น firstName/lastName
      if (data.name) {
        const parts = data.name.trim().split(' ');
        payload.firstName = parts[0];
        payload.lastName = parts.slice(1).join(' ') || '';
      }

      const res = await fetch(`${API_URL}/members/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update');

      // อัปเดต State ในหน้าจอทันที
      setUser((prev) => ({ ...prev, ...data }));

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, refreshProfile: fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}