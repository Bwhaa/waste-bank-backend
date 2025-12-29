import React from 'react';

// --- Date Option ---
interface DateOptionProps {
  date: Date;
  active: boolean;
  onClick: () => void;
}

export const DateOption: React.FC<DateOptionProps> = ({ date, active, onClick }) => {
  const dayNum = date.getDate();
  const dayName = date.toLocaleDateString('th-TH', { weekday: 'short' });

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition flex-shrink-0 ${
        active 
        ? 'bg-[#00A86B] border-[#00A86B] text-white shadow-md shadow-green-200' 
        : 'bg-white border-slate-100 text-slate-400 hover:border-green-200'
      }`}
    >
      <span className="text-xs">{dayName}</span>
      <span className="text-xl font-bold">{dayNum}</span>
    </button>
  );
};

// --- Time Option ---
interface TimeOptionProps {
  time: string;
  active: boolean;
  onClick: () => void;
}

export const TimeOption: React.FC<TimeOptionProps> = ({ time, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition ${
        active
        ? 'bg-[#00A86B] border-[#00A86B] text-white shadow-md shadow-green-200'
        : 'bg-white border-slate-100 text-slate-600 hover:border-green-200'
      }`}
    >
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
       <span className="font-bold">{time}</span>
    </button>
  );
};