// frontend/types/waste.ts

export type CategoryType = 'all' | 'plastic' | 'paper' | 'metal' | 'glass' | 'electronic' | 'clothing';

export interface WasteItem {
  id: number | string;
  title: string;
  desc: string;
  points: string;
  tags: string[];
  category: CategoryType; // ใช้ Type ที่กำหนดไว้ข้างบน
  iconColor: string;      // เช่น 'bg-blue-500'
  iconText: string;       // เช่น 'text-white'
  isHighlight?: boolean;  // Optional
  specialBadge?: string;  // Optional
  subPoints?: string;     // Optional
  warning?: string;       // Optional
}

export interface Category {
  id: CategoryType;
  label: string;
  icon: string;
}