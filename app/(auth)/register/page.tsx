// frontend/app/(auth)/register/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service'; // ต้องมีไฟล์นี้ก่อนนะ (ตามที่คุยกันรอบที่แล้ว)

// 1. สร้างกฎการตรวจสอบข้อมูล (Validation Schema)
const registerSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phone: z.string().length(10, 'เบอร์โทรศัพท์ต้องมี 10 หลัก'),
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 2. เช็คก่อนว่ามี Token ไหม (ถ้าไม่มีให้ไป Login ก่อน)
  useEffect(() => {
    const token = authService.getAccessToken();
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  // 3. ตั้งค่า Form Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // 4. ฟังก์ชันเมื่อกดปุ่ม "เข้าสู่ระบบ" (บันทึกข้อมูล)
  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      console.log('Sending data:', data);
      
      // เรียก API PUT /members/me เพื่ออัปเดตข้อมูล
      await userService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address
      });

      // สำเร็จ! ไปหน้า Dashboard
      alert('ลงทะเบียนสำเร็จ! ยินดีต้อนรับสู่ธนาคารขยะ');
      window.location.href = '/'; 

    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- ส่วน Header สีเขียว --- */}
      <div className="bg-[#4ADE80] p-8 text-center text-white rounded-b-[3rem] shadow-lg relative overflow-hidden">
         {/* ลวดลายตกแต่ง (Circles) */}
         <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

         <div className="relative z-10">
            {/* Icon Recycle */}
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wide">ธนาคารขยะเพื่อชุมชน</h1>
            <p className="text-sm opacity-90 mt-2 font-light">
              ร่วมกันสร้างชุมชนที่ยั่งยืน<br/>เปลี่ยนขยะให้เป็นมูลค่า
            </p>
         </div>
      </div>

      {/* --- ส่วน Form --- */}
      <div className="p-6 max-w-md mx-auto -mt-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">ลงทะเบียนเข้าใช้งาน</h2>
              <p className="text-slate-500 text-sm mt-1">กรุณากรอกข้อมูลของท่านเพื่อยืนยันตัวตน</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ชื่อ */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ชื่อ <span className="text-red-500">*</span></label>
              <input
                {...register('firstName')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
                placeholder="ระบุชื่อจริง"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName.message}</p>}
            </div>

            {/* นามสกุล */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">นามสกุล <span className="text-red-500">*</span></label>
              <input
                {...register('lastName')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
                placeholder="ระบุนามสกุล"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName.message}</p>}
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
              <div className="relative">
                  <input
                    {...register('phone')}
                    type="tel"
                    maxLength={10}
                    className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
                    placeholder="0XX-XXX-XXXX"
                  />
                  <div className="absolute left-3 top-3.5 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
            </div>

            {/* ที่อยู่ */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ที่อยู่ปัจจุบัน <span className="text-red-500">*</span></label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none placeholder:text-slate-400"
                placeholder="บ้านเลขที่, หมู่, ตำบล, อำเภอ..."
              />
              {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</p>}
            </div>

            {/* ปุ่ม Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังบันทึก...
                </span>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-green-50/80 p-4 rounded-xl border border-green-100/50 backdrop-blur-sm">
            <h4 className="text-green-800 font-bold text-sm mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ข้อมูลสำคัญ:
            </h4>
            <ul className="text-xs text-green-700 space-y-1.5 list-disc pl-5 opacity-90">
                <li>ข้อมูลของท่านจะถูกเก็บรักษาอย่างปลอดภัยตามนโยบายความเป็นส่วนตัว</li>
                <li>เบอร์โทรศัพท์ใช้สำหรับยืนยันตัวตนและรับสิทธิพิเศษ</li>
            </ul>
        </div>
      </div>
    </div>
  );
}