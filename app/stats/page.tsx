'use client';

import { useRouter } from 'next/navigation';
import { USER_STATS } from '@/data/user-mock';

export default function StatsPage() {
  const router = useRouter();

  const stats = [
    { 
      label: 'ครั้งที่ฝาก', 
      value: USER_STATS.depositCount.toLocaleString(), 
      icon: '♻️', 
      bg: 'bg-green-100', 
      color: 'text-green-600' 
    },
    { 
      label: 'กก. รวม', 
      value: USER_STATS.totalWeight.toLocaleString(), 
      icon: '⚖️', 
      bg: 'bg-blue-100', 
      color: 'text-blue-600' 
    },
    { 
      label: 'ครั้งที่แลก', 
      value: USER_STATS.redeemedCount.toLocaleString(), 
      icon: '🎁', 
      bg: 'bg-orange-100', 
      color: 'text-orange-600' 
    },
    { 
      label: 'แต้มบริจาค', 
      value: USER_STATS.donatedPoints.toLocaleString(), 
      icon: '❤️', 
      bg: 'bg-pink-100', 
      color: 'text-pink-600' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-40 flex items-center gap-4 shadow-sm mb-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition">
           <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-800">สรุปการใช้งาน</h1>
      </div>

      <div className="px-6 space-y-4">
        {/* Banner */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                📊
            </div>
            <h2 className="text-xl font-bold text-slate-800">ภาพรวมของคุณ</h2>
            <p className="text-slate-500 text-sm">สถิติการใช้งานตั้งแต่เริ่มสมัครสมาชิก</p>
        </div>

        {/* Grid Stats */}
        <div className="flex flex-col gap-4">
            {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-start hover:shadow-md transition"
                >
                    
                    {/* 🔥 ไม้ตาย: ใช้ style={{ marginRight: '60px' }} สั่งห่าง 60px ตรงๆ เลย */}
                    <div 
                      className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}
                      style={{ marginRight: '20px' }} 
                    >
                        {stat.icon}
                    </div>
                    
                    {/* Text Detail */}
                    <div className="flex flex-col items-start">
                        <p className="text-sm text-slate-400 font-medium mb-1">{stat.label}</p>
                        <p className="text-4xl font-extrabold text-slate-900 leading-none">{stat.value}</p>
                    </div>

                </div>
            ))}
        </div>
      </div>
    </div>
  );
}