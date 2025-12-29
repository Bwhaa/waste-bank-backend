import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ฟังก์ชันเทพที่ช่วยให้รวม class แล้วไม่ตีกัน
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}