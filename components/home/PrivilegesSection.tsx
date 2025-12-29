export function PrivilegesSection() {
  return (
    <div className="px-6 mb-8">
      <h3 className="font-bold text-slate-800 mb-4 text-lg">สิทธิพิเศษ</h3>
      <div className="space-y-3">
        {/* Item 1 */}
        <div className="bg-purple-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-95 transition">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">สิทธิพิเศษสมาชิก VIP</h4>
              <p className="text-xs text-slate-500">รับส่วนลด 20% ทุกการแลกของรางวัล</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        {/* Item 2 */}
        <div className="bg-green-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer active:scale-95 transition">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">โบนัสแต้มรายเดือน</h4>
              <p className="text-xs text-slate-500">ฝากขยะครบ 10 ครั้ง รับโบนัส 200 แต้ม</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  );
}