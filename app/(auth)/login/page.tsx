// frontend/app/(auth)/login/page.tsx
'use client';

import LineLoginButton from '@/components/features/auth/LineLoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">ยินดีต้อนรับ</h1>
          <p className="text-slate-500 mt-2">สมาชิกธนาคารขยะชุมชน</p>
        </div>

        {/* ปุ่ม Login LINE เด่นๆ */}
        <div className="mb-8">
          <LineLoginButton />
        </div>

        {/* เส้นคั่น */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-slate-400">ปลอดภัยและรวดเร็ว</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          ระบบจะสมัครสมาชิกให้อัตโนมัติเมื่อเข้าใช้งานครั้งแรก
        </p>

      </div>
    </div>
  );
}