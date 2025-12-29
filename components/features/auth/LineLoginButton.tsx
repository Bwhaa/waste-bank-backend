'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function LineLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // เริ่มต้น LIFF
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        
        // ✅ [แก้ตรงนี้] เพิ่ม Logic: ถ้ากลับมาจาก LINE แล้ว (Login ค้างอยู่) ให้ยิง Backend เลย
        if (liff.isLoggedIn()) {
           console.log("User is logged in via LIFF, auto-connecting to Backend...");
           handleBackendHandshake(); 
        }

      } catch (err) {
        console.error('LIFF Init Error:', err);
      }
    };
    initLiff();
  }, []);

  // แยกฟังก์ชันยิง Backend ออกมา
  const handleBackendHandshake = async () => {
    try {
      setIsLoading(true);
      const idToken = liff.getIDToken();
      if (!idToken) return; // ถ้าไม่มี Token ก็จบ

      // ส่ง Token ไปแลก Cookie ที่ Backend
      await authService.loginWithLine(idToken);

      // ถ้าผ่าน -> ไปหน้าแรกโลด!
      console.log("Login Success! Redirecting...");
      window.location.href = '/'; 
      
    } catch (err) {
      console.error(err);
      setError('เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่');
      // ถ้า Error อาจจะ Logout LIFF ทิ้ง เพื่อให้กดใหม่ได้
      liff.logout(); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineLogin = () => {
    // ถ้ายังไม่ Login LINE -> สั่ง Login
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href }); 
    } else {
      // ถ้า Login LINE แล้ว (แต่ Cookie หาย) -> ยิง Backend ใหม่
      handleBackendHandshake();
    }
  };

  return (
    <div className="w-full">
      {error && <div className="text-red-500 text-sm mb-2 text-center bg-red-50 p-2 rounded">{error}</div>}
      
      <button
        onClick={handleLineLogin}
        disabled={isLoading}
        className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
      >
        {isLoading ? (
          <span>กำลังประมวลผล...</span>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M20.6 10c0-4.4-4.3-8-9.6-8s-9.6 3.6-9.6 8c0 3.9 3.4 7.2 8 7.9.3.1.7.2.8 0 .1 0 .2-.3.1-.5l-.3-1.8c0-.2.1-.4.4-.3 1.6.4 3.2.3 4.8-.4 3.3-1.4 5.4-3.5 5.4-4.9z" fill="white"/>
            </svg>
            เข้าใช้งานด้วย LINE
          </>
        )}
      </button>
    </div>
  );
}