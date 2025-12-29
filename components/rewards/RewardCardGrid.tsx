import React from 'react';
import { RewardItem } from '@/types/rewards';

interface Props {
  item: RewardItem;
}

export const RewardCardGrid: React.FC<Props> = ({ item }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex flex-col justify-between h-full relative group hover:shadow-md transition">
      <div className="absolute top-2 right-2 text-yellow-400">★</div>
      <div className="flex justify-center mb-3 text-5xl group-hover:scale-110 transition duration-300">
        {item.image}
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-2 leading-tight">{item.name}</h4>
        <p className="text-orange-600 font-bold text-lg">{item.points} แต้ม</p>
      </div>
    </div>
  );
};