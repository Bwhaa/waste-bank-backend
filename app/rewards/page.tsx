'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

// Components
import { RewardCard } from '@/components/rewards/RewardCard';
import { DonationCard } from '@/components/rewards/DonationCard';
import { RewardFilter } from '@/components/rewards/RewardFilter'; 
// ❌ ลบ Import StatsSection ออกแล้ว

// Data & Constants
import { REWARDS_DATA, DONATION_DATA, CATEGORY_IDS } from '@/data/rewards-mock';

export default function RewardsPage() {
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_IDS.ALL);
  const isDonationMode = selectedCategory === CATEGORY_IDS.DONATION;

  // Filter Logic
  const filteredRewards = useMemo(() => {
    if (selectedCategory === CATEGORY_IDS.ALL) return REWARDS_DATA;
    return REWARDS_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const popularRewards = useMemo(() => 
    filteredRewards.filter(item => item.isPopular), 
  [filteredRewards]);

  // Actions
  const handleRedeem = (id: number) => {
    const item = REWARDS_DATA.find((i) => i.id === id);
    if (item) addToCart(item);
  };

  const handleDonate = (id: number) => {
    console.log('Donate ID:', id);
    // Logic การบริจาค
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-44">
      
      {/* 🟢 Header Section */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="px-6 pt-6 pb-2 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition">
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800">แลกของรางวัล</h1>
          </div>
          
          {/* ปุ่ม Cart */}
          <button onClick={() => router.push('/rewards/confirm')} className="relative p-2 group">
            <svg className="w-6 h-6 text-slate-700 group-hover:text-green-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-scaleIn">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-[#00A86B] rounded-2xl p-5 text-white flex justify-between items-center shadow-lg shadow-green-100">
            <div>
              <p className="text-green-100 text-xs mb-1">แต้มที่สามารถใช้ได้</p>
              <h2 className="text-3xl font-bold">2,450 แต้ม</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
               <span className="text-2xl">🪙</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 Content Body */}
      <div className="px-6 mt-4">

        {/* ✅ Reward Filter */}
        <RewardFilter 
          currentCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        {isDonationMode ? (
           /* 💖 โหมดบริจาค */
           <div className="animate-fadeIn">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-xl">💝</span>
                 <h3 className="font-bold text-slate-800 text-lg">บริจาคแต้มเพื่อสังคม</h3>
              </div>
              <p className="text-xs text-slate-500 pl-8 mb-4">ใช้แต้มของคุณช่วยเหลือผู้อื่นในชุมชน</p>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 flex items-center justify-between shadow-sm mb-6">
                 <div>
                    <p className="text-purple-700 text-sm font-bold mb-1">ยอดบริจาคสะสม</p>
                    <h2 className="text-purple-900 text-4xl font-extrabold">1,250 แต้ม</h2>
                 </div>
                 <div className="text-5xl drop-shadow-sm filter">❤️</div>
              </div>

              <div className="space-y-4">
                 {DONATION_DATA.map((item) => (
                    <DonationCard key={item.id} item={item} onDonate={handleDonate} />
                 ))}
              </div>
           </div>
        ) : (
           /* 🎁 โหมดแลกของ */
           <div className="animate-fadeIn">
              {/* Popular Section */}
              {popularRewards.length > 0 && selectedCategory === CATEGORY_IDS.ALL && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500 text-lg">⭐</span>
                    <span className="text-orange-500 text-lg">🔥</span>
                    <h3 className="font-bold text-slate-800 text-lg">สินค้ายอดนิยม</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {popularRewards.map((item) => (
                      <RewardCard key={item.id} item={item} layout="grid" />
                    ))}
                  </div>
                </div>
              )}

              {/* Reward List */}
              <div className="space-y-4">
                  {filteredRewards.map((item) => (
                    <RewardCard key={item.id} item={item} layout="list" onRedeem={handleRedeem} />
                  ))}
              </div>

              {/* Empty State */}
              {filteredRewards.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 mt-4">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-slate-500 font-medium">ไม่พบสินค้าในหมวดหมู่นี้</p>
                  </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
}