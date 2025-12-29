import { WasteItem } from '@/types/waste';

interface Props {
  item: WasteItem;
}

export const WasteCard = ({ item }: Props) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow relative overflow-hidden">
      
      {/* Icon */}
      <div className={`w-14 h-14 ${item.iconColor} ${item.iconText} rounded-2xl flex-shrink-0 flex items-center justify-center`}>
         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          {/* ฝั่งซ้าย: ชื่อและคำอธิบาย */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
            <p className="text-xs text-slate-400 mb-1">{item.desc}</p>
          </div>

          {/* ฝั่งขวา: ป้ายยอดนิยม (สไตล์เดิม) และ แต้ม */}
          <div className="text-right flex-shrink-0 ml-2 flex flex-col items-end gap-1">
            {/* ✅ ใช้ Style เดิม (rounded, px-1.5) แต่จัดชิดขวา */}
            {item.isHighlight && (
               <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                 ยอดนิยม
               </span>
            )}
            <span className="block text-green-600 font-bold text-sm whitespace-nowrap">⚡ {item.points}</span>
            {item.subPoints && <span className="text-[10px] text-slate-400 block">{item.subPoints}</span>}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-2">
          <p className="text-[10px] text-slate-400 mb-1">ตัวอย่าง:</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        {item.warning && (
          <div className="mt-2 text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
             ⚠️ {item.warning}
          </div>
        )}
      </div>
    </div>
  );
};