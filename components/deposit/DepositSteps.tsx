export const DepositSteps = () => {
  return (
    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mt-6 relative z-10">
      <h3 className="font-bold text-blue-800 mb-3">ขั้นตอนการฝากขยะ</h3>
      <div className="space-y-3">
        <div className="flex gap-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div><p className="text-xs text-blue-800">เตรียมขยะตามประเภทที่ระบุ</p></div>
        <div className="flex gap-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div><p className="text-xs text-blue-800">ทำความสะอาดขยะให้แห้งและสะอาด</p></div>
        <div className="flex gap-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div><p className="text-xs text-blue-800">นำมาฝากที่จุดรับฝากขยะในชุมชน</p></div>
        <div className="flex gap-3"><div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</div><p className="text-xs text-blue-800">รับแต้มเข้าบัญชีทันที</p></div>
      </div>
    </div>
  );
};