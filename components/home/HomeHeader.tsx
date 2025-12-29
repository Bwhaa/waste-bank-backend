'use client';

import { UserProfile } from '@/services/user.service';

interface Props {
  user: UserProfile | null;
}

export function HomeHeader({ user }: Props) {
  return (
    <div className="pt-8 px-6 pb-2 bg-white sticky top-0 z-30 font-sans">
      
      {/* 🟢 ส่วนบน: คำทักทายและไอคอน */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-200 shadow-sm shrink-0">
             <span className="text-xl">🌿</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium leading-none mb-1">สวัสดี,</span>
            <h1 className="text-lg font-bold text-[#00A86B] leading-none">
              {user?.firstName ? `คุณ${user.firstName}` : 'ผู้มาเยือน'}
            </h1>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="relative p-2 rounded-full hover:bg-slate-50 transition border border-slate-100 text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-50 transition border border-slate-100 text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </button>
        </div>
      </div>

      {/* 🟢 การ์ดหลัก: แก้ไขเส้นขอบให้เขียวสว่างขึ้น (#00A86B) */}
      <div className="bg-white rounded-3xl p-5 border border-[#00A86B] shadow-sm relative overflow-hidden">
        
        {/* หัวข้อการ์ด */}
        <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 mb-1">ธนาคารขยะเพื่อชุมชน</h2>
            <p className="text-xs text-slate-500 font-medium">รวมพลังสร้างสิ่งแวดล้อมที่ดี</p>
        </div>

        {/* 🟢 การ์ดใน: พื้นหลังสีเขียวเข้ม (แสดงแต้ม) */}
        <div 
          className="rounded-2xl p-5 flex justify-between items-center text-white relative overflow-hidden shadow-inner"
          style={{ backgroundColor: '#198754' }} 
        >
             {/* Text Left */}
             <div className="text-left relative z-10">
                <p className="text-[10px] text-green-100 mb-1 font-medium opacity-90">แต้มสะสมทั้งหมด</p>
                <span className="text-4xl font-bold tracking-tight block">
                  {user?.pointBalance?.toLocaleString() || 0}
                </span>
             </div>
             
             {/* Text Right */}
             <div className="flex flex-col items-end relative z-10">
                <div className="text-[10px] text-green-100 opacity-90 mb-1">เดือนนี้</div>
                <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span className="font-bold text-xl text-white">+{user?.monthlyPoints?.toLocaleString() || 0}</span>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
}