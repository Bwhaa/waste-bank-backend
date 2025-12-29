'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// Import ส่วนที่เราแยกไฟล์ไว้ (ยังคงใช้ได้อยู่)
import { WASTE_DATA, CATEGORIES } from '@/data/wasteData';
import { CategoryType } from '@/types/waste';
import { WasteCard } from '@/components/deposit/WasteCard';
import { HighPointSection } from '@/components/deposit/HighPointSection';
import { DepositSteps } from '@/components/deposit/DepositSteps';

export default function DepositPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter Logic (เหมือนเดิม)
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return WASTE_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(query) || 
                            item.tags.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const highPointItems = useMemo(() => WASTE_DATA.filter(i => i.isHighlight), []);
  const currentCategoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || 'ทั้งหมด';

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans" onClick={() => isDropdownOpen && setIsDropdownOpen(false)}>
      
      {/* 🟢 Header (เหมือนเดิม) */}
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition">
            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <h1 className="text-xl font-bold text-slate-800">การฝากขยะ</h1>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="ค้นหาประเภทขยะ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <div className="px-6 mt-4 space-y-6">
        
        {/* 🟢 Info Box (แก้ไอคอนกลับมาเป็น SVG ตัวเดิม) */}
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex gap-3">
           {/* 👇 ไอคอนตัวเดิมที่คุณต้องการ */}
           <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
           <div>
              <h3 className="font-bold text-green-800 text-sm mb-1">ข้อมูลสำหรับการเตรียมความพร้อม</h3>
              <p className="text-xs text-green-700 leading-relaxed">รายละเอียดด้านล่างเป็นข้อมูลแต้มรางวัลและประเภทขยะที่รับฝาก เพื่อให้คุณเตรียมขยะก่อนมาฝากจริง</p>
           </div>
        </div>

        {/* High Point Section */}
        {!searchQuery && selectedCategory === 'all' && (
           <HighPointSection items={highPointItems} />
        )}

        {/* 🟢 Filter Section (แก้ Dropdown ให้กลับไปเหมือนเดิมเป๊ะๆ) */}
        <div className="flex justify-between items-center mb-2 relative z-20">
            <div>
                <h2 className="text-lg font-bold text-slate-800">รายการรับซื้อ</h2>
                <p className="text-xs text-slate-500">อัปเดตราคาล่าสุดวันนี้</p>
            </div>

            {/* Dropdown แบบเดิม */}
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                    }}
                    // 👇 คืนค่า class เดิม: w-48, py-3, px-6, text-lg
                    className="bg-[#00A86B] text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-between gap-3 shadow-md active:scale-95 transition w-48"
                >
                    <span className="text-lg">{currentCategoryLabel}</span>
                    <svg className={`w-6 h-6 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                </button>

                {isDropdownOpen && (
                    // 👇 คืนค่า class เดิม: w-48, gap-2, ไม่มี icon ใน list
                    <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 w-48 z-50 animate-fadeIn">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setIsDropdownOpen(false);
                                }}
                                className={`
                                    py-3 px-4 rounded-xl font-bold text-left shadow-sm transition active:scale-95 text-base border-2
                                    ${selectedCategory === cat.id 
                                        ? 'bg-[#00A86B] text-white border-[#00A86B]' 
                                        : 'bg-white text-[#00A86B] border-[#00A86B] hover:bg-green-50'
                                    }
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Waste List */}
        <div className="space-y-4 relative z-0">
           {filteredData.map((item) => (
             <WasteCard key={item.id} item={item} />
           ))}
        </div>
        
        {/* Empty State */}
        {filteredData.length === 0 && (
            <div className="flex flex-col items-center py-10 text-slate-400">
                {/* 👇 ใช้ SVG เดิมแทน Emoji */}
                <span className="text-4xl mb-2">🔍</span>
                <p>ไม่พบรายการในหมวดหมู่นี้</p>
            </div>
        )}

        {/* Deposit Steps */}
        <DepositSteps />

      </div>
    </div>
  );
}