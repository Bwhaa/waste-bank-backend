'use client';

import { UserProfile } from '@/services/user.service';

interface Props {
  user?: UserProfile | null;
}

export function UserStats({ user }: Props) {
  // Mock Data (รอเชื่อม API จริงแต่ละส่วน)
  const stats = [
    { 
      label: 'ครั้งที่ฝาก', 
      value: '8', // ใช้ user?.depositCount || '0' ในอนาคต
      unit: 'ครั้ง', 
      icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
      bg: 'bg-green-100'
    },
    { 
      label: 'กก. รวม', 
      value: '124.5', 
      unit: 'กก.', 
      icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>,
      bg: 'bg-blue-100'
    },
    { 
      label: 'ครั้งที่แลก', 
      value: '2', 
      unit: 'ครั้ง', 
      icon: <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
      bg: 'bg-orange-100'
    },
    { 
      label: 'แต้มบริจาค', 
      value: '500', 
      unit: 'แต้ม', 
      icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
      bg: 'bg-purple-100'
    },
  ];

  return (
    <div className="px-6 pb-8">
      {/* Header ของ Section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-slate-800 rounded-lg text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 className="font-bold text-slate-800 text-lg">สรุปการใช้งาน</h3>
      </div>
      
      {/* Grid 4 ช่อง */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                        {stat.icon}
                    </div>
                </div>
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-800">{stat.value}</span>
                        <span className="text-[10px] text-slate-400">{stat.unit}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}