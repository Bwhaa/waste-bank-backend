'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ถ้ายังไม่พร้อม หรือหา body ไม่เจอ ไม่ต้องทำอะไร
  if (!mounted || typeof document === 'undefined') return null;

  // ✅ ย้อนกลับไปใช้วิธีส่งตรงไปที่ body (ลบ div ครอบออก)
  return createPortal(children, document.body);
};