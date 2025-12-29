export function NewsSection() {
  return (
    <div className="px-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-lg">ข่าวสารและกิจกรรม</h3>
        <span className="text-xs text-green-600 font-medium cursor-pointer">ดูทั้งหมด</span>
      </div>
      
      <div className="space-y-4">
        {/* News Item 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-800 text-sm line-clamp-1">โปรโมชั่นพิเศษ! แต้มเพิ่ม 2 เท่า</h4>
            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">โปรโมชั่น</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">ฝากขยะพลาสติกรับแต้มเพิ่ม 2 เท่า วันนี้ - 30 ส.ค.</p>
          <div className="flex items-center text-[10px] text-slate-400 gap-2">
             <span>25 ก.ค. 2025</span>
          </div>
        </div>
        {/* News Item 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
             <h4 className="font-bold text-slate-800 text-sm line-clamp-1">กิจกรรมทำความสะอาดชุมชน</h4>
             <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold">กิจกรรม</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">ร่วมกิจกรรมวันเสาร์นี้ รับแต้มพิเศษ 500 แต้ม</p>
          <div className="flex items-center text-[10px] text-slate-400 gap-2">
             <span>23 ก.ค. 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}