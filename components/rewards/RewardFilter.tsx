'use client';

import React, { useState, useRef } from 'react';
import { CATEGORIES } from '@/data/rewards-mock';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
  currentCategory: string;
  onSelect: (id: string) => void;
}

export const RewardFilter: React.FC<Props> = ({ currentCategory, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ใช้ Hook ที่เราสร้าง เพื่อสั่งปิดเมื่อคลิกข้างนอก
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // หา Label ของหมวดหมู่ปัจจุบันมาแสดงที่ปุ่ม
  const currentLabel = CATEGORIES.find((c) => c.id === currentCategory)?.label || 'ทั้งหมด';

  return (
    <div className="flex justify-between items-center relative z-20 mb-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">รายการของรางวัล</h2>
        <p className="text-xs text-slate-500">เลือกดูตามหมวดหมู่</p>
      </div>

      {/* Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#00A86B] text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-between gap-3 shadow-md active:scale-95 transition w-48"
        >
          <span className="text-lg">{currentLabel}</span>
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 w-48 z-50 animate-fadeIn origin-top-right">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelect(cat.id);
                  setIsOpen(false);
                }}
                className={`
                  py-3 px-4 rounded-xl font-bold text-left shadow-sm transition active:scale-95 text-base border-2 flex items-center gap-2
                  ${
                    currentCategory === cat.id
                      ? 'bg-[#00A86B] text-white border-[#00A86B]'
                      : 'bg-white text-[#00A86B] border-[#00A86B] hover:bg-green-50'
                  }
                `}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};