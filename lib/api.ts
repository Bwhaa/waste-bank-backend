// frontend/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // แก้ Port ตาม Backend

// ฟังก์ชันดึง Token จาก LocalStorage (ง่ายและชัวร์สุดสำหรับตอนนี้)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// ตัวจัดการ API กลาง
export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
       if (res.status === 401) {
         // Token หมดอายุ -> ไล่ไป Login ใหม่
         localStorage.removeItem('token');
         window.location.href = '/login';
       }
       throw new Error(`API Error: ${res.status}`);
    }
    return res.json();
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  patch: async <T>(endpoint: string, body: any): Promise<T> => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },
};