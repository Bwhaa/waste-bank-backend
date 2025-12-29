import { WasteItem } from '@/types/waste';

interface Props {
  items: WasteItem[];
}

export const HighPointSection = ({ items }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        <h3 className="font-bold text-slate-800">ขยะที่ให้แต้มสูง</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="min-w-[160px] bg-orange-50/50 p-4 rounded-2xl border border-orange-100 relative flex flex-col gap-3">
            <div>
              <div className={`w-10 h-10 ${item.iconColor} ${item.iconText} rounded-xl flex items-center justify-center mb-3`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight mb-2">{item.title}</h4>
            </div>
            <div>
              <p className="text-orange-600 font-bold text-xl">{item.points.replace(' แต้ม', '')} <span className="text-base">แต้ม</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};