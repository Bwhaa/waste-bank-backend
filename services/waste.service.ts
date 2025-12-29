// frontend/services/waste.service.ts

import { fetchAPI } from '@/lib/api-client';
import { WasteType } from '@/types';

export const wasteService = {
  /**
   * ดึงรายการประเภทขยะและราคาปัจจุบัน
   * Note: เป็น Public Endpoint ไม่ต้องใช้ Token
   */
  getAll: async () => {
    return fetchAPI<WasteType[]>('/waste-types', {
      // ✅ Senior Point 1: Optimization
      // บอก api-client ว่าไม่ต้องเสียเวลาไปแกะ Cookie หรือแนบ Bearer Token
      // ลดภาระฝั่ง Client และทำให้ Request เบาขึ้น
      requiresAuth: false, 

      // ✅ Senior Point 2: Data Freshness
      // ราคาขยะมีการเปลี่ยนแปลง (Dynamic Data) ห้าม Cache เด็ดขาด
      cache: 'no-store', 
    });
  },
};