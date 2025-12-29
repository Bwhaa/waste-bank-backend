import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>, // ✅ แก้ตรงนี้: เติม | null เพื่อบอกว่ารับค่าว่างได้
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // ถ้าไม่มี Element หรือคลิกข้างใน Element ตัวเอง -> ไม่ทำอะไร
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};