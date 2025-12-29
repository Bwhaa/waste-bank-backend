import React from 'react';
import { DonationItem } from '@/data/rewards-mock';

interface Props {
  item: DonationItem;
  onDonate?: (id: number) => void;
}

export const DonationCard: React.FC<Props> = ({ item, onDonate }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
      {/* Icon */}
      <div className={`w-16 h-16 ${item.color} ${item.textColor} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>
        {item.icon}
      </div>
      
      {/* Detail */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{item.desc}</p>
        
        <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400">ขั้นต่ำ</p>
              <p className={`font-bold text-sm ${item.textColor}`}>{item.minPoints} แต้ม</p>
            </div>
            <button 
              onClick={() => onDonate && onDonate(item.id)}
              className={`${item.btnColor} text-white text-xs font-bold px-5 py-2 rounded-lg active:scale-95 transition shadow-sm`}
            >
              บริจาค
            </button>
        </div>
      </div>
    </div>
  );
};