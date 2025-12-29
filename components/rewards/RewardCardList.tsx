import React from 'react';
import { RewardItem } from '@/types/rewards';

interface Props {
  item: RewardItem;
  onRedeem?: (id: number) => void;
}

export const RewardCardList: React.FC<Props> = ({ item, onRedeem }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 relative group hover:border-green-200 transition">
      {item.isPopular && (
        <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
          <span className="text-yellow-500 text-xs">★</span> ยอดนิยม
        </div>
      )}
      <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 group-hover:bg-green-50 transition">
        {item.image}
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h4 className="font-bold text-slate-800 text-sm mb-1 pr-16">{item.name}</h4>
          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-green-600 font-bold text-lg">{item.points} แต้ม</p>
            <p className="text-[10px] text-slate-400">📦 คงเหลือ {item.stock} ชิ้น</p>
          </div>
          <button 
            onClick={() => onRedeem?.(item.id)}
            className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-600 active:scale-95 transition shadow-sm shadow-green-200 flex items-center gap-1"
          >
            แลก
          </button>
        </div>
      </div>
    </div>
  );
};