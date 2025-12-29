import React from 'react';
import { CATEGORIES } from '@/data/rewards-mock';

interface Props {
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export const CategoryTabs: React.FC<Props> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto px-6 pb-4 no-scrollbar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border
            ${selectedCategory === cat.id 
              ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-200' 
              : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};