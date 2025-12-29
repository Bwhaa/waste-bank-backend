// Master Data: ประเภทขยะ
export interface WasteType {
  id: number;
  name: string;
  // Backend ส่งมาเป็น String (Decimal) ห้ามแปลงเป็น Number เพื่อคำนวณเงินเองเด็ดขาด
  marketPrice: string; 
  pointRate: string; 
  unit: string; // เช่น KG, DOZEN
  imageUrl: string;
  description?: string;
  category: string;
  isActive: boolean;
}

// Wrapper สำหรับ Response มาตรฐาน
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ----------------------------------------------------
// ✅ ส่วนที่ต้องเพิ่มใหม่ (เพื่อให้ auth.service.ts รู้จัก)
// ----------------------------------------------------

// ข้อมูลที่ส่งไปตอน Login (Email)
export interface LoginRequest {
  email?: string;
  password?: string;
  idToken?: string; // เผื่อกรณี LINE
}

// สิ่งที่ Backend ส่งกลับมา (Token)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// ข้อมูลที่แกะออกมาจาก Token (User ID & Role)
export interface UserTokenPayload {
  sub: string;        // User ID
  role: string;       // MEMBER, STAFF, ADMIN
  iat: number;        // Issued At
  exp: number;        // Expire At
}