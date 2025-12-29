import Link from 'next/link';

export function MainMenu() {
  const menus = [
    {
      label: 'ฝากขยะ',
      desc: 'นำขยะมาแลกแต้ม',
      href: '/deposit',
      color: 'text-green-600',
      bg: 'bg-green-50',
      borderHover: 'hover:border-green-200',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
    },
    {
      label: 'แลกของรางวัล',
      desc: 'ใช้แต้มแลกของรางวัล',
      href: '/rewards',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      borderHover: 'hover:border-yellow-200',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
    },
    {
      label: 'ธุรกรรม',
      desc: 'ประวัติการทำรายการ',
      href: '/history',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      borderHover: 'hover:border-blue-200',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
    },
    {
      label: 'ข่าวสาร',
      desc: 'ข่าวและกิจกรรม',
      href: '/news',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      borderHover: 'hover:border-teal-200',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
    },
    // 🆕 เพิ่มปุ่มที่ 5: สรุปการใช้งาน
    {
      label: 'สรุปการใช้งาน',
      desc: 'การใช้งานของคุณ',
      href: '/stats', // ลิงก์ไปหน้าใหม่
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      borderHover: 'hover:border-slate-300',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
    }
  ];

  return (
    <div className="px-6 mb-8">
      <div className="grid grid-cols-2 gap-4">
        {menus.map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            className={`bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 ${item.borderHover} transition active:scale-95 flex flex-col items-start gap-3`}
          >
            <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center ${item.color}`}>
               {item.icon}
            </div>
            <div>
               <h3 className="font-bold text-slate-800 text-sm">{item.label}</h3>
               <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}