'use client';

import { ModalPortal } from '@/components/ui/ModalPortal';

interface ConfirmModalProps { isOpen: boolean; onClose: () => void; onConfirm: () => void; totalPoints: number; dateStr: string; }
interface SuccessModalProps { isOpen: boolean; onClose: () => void; dateStr: string; }
interface InsufficientModalProps { isOpen: boolean; onClose: () => void; }

// --- 1. ✅ Modal ยืนยัน (กรอบเขียว + ขอบมน + ไม่มีไอคอน) ---
export const ConfirmRedemptionModal = ({ isOpen, onClose, onConfirm, totalPoints, dateStr }: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4"
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}
      >
         <div 
            className="bg-white p-8 text-center shadow-2xl animate-scaleIn relative"
            style={{ 
              width: '100%', maxWidth: '380px',
              border: '2px solid #00A86B',
              borderRadius: '24px' // 👈 บังคับขอบมนตรงนี้
            }}
         >
            <h3 className="text-xl font-bold mb-4 text-slate-800">ยืนยันการแลก?</h3>
            <div className="space-y-1 mb-8">
                <p className="text-slate-600">ใช้แต้มรวม: <b className="text-[#00A86B] text-lg">{totalPoints.toLocaleString()}</b> แต้ม</p>
                <p className="text-sm text-slate-400">กำหนดรับของ: {dateStr}</p>
            </div>

            <div className="flex gap-3">
               <button 
                 onClick={onClose} 
                 className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition"
               >
                 ยกเลิก
               </button>
               <button 
                 onClick={onConfirm} 
                 className="flex-1 py-3 bg-[#00A86B] text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition"
               >
                 ยืนยัน
               </button>
            </div>
         </div>
      </div>
    </ModalPortal>
  );
};

// --- 2. ✅ Modal สำเร็จ (กรอบเขียว + ขอบมน + ไอคอนเขียวอ่อน) ---
export const SuccessRedemptionModal = ({ isOpen, onClose, dateStr }: SuccessModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4"
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}
      >
         <div 
            className="bg-white p-8 pt-12 text-center shadow-2xl animate-scaleIn relative"
            style={{ 
              width: '100%', maxWidth: '380px',
              overflow: 'visible',
              border: '2px solid #00A86B',
              borderRadius: '24px' // 👈 บังคับขอบมนตรงนี้
            }}
         >
            {/* ไอคอนลอย */}
            <div 
              className="absolute rounded-full flex items-center justify-center shadow-md"
              style={{
                width: '90px', height: '90px',
                backgroundColor: '#D1FAE5', // เขียวอ่อน
                top: '-45px', left: '50%', transform: 'translateX(-50%)' 
              }}
            >
               <span className="text-5xl">🎉</span>
            </div>
            
            <div className="mt-6">
               <h3 className="text-2xl font-bold mb-2 text-slate-800">แลกสำเร็จ!</h3>
               <p className="mb-8 text-slate-500 text-sm">รับของ: {dateStr}</p>
               
               <button 
                 onClick={onClose} 
                 className="text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:opacity-90 transition"
                 style={{ 
                   backgroundColor: '#00A86B', 
                   width: '100%', padding: '16px', fontSize: '18px' 
                 }}
               >
                 กลับหน้าหลัก
               </button>
            </div>
         </div>
      </div>
    </ModalPortal>
  );
};

// --- 3. ✅ Modal แต้มไม่พอ (กรอบแดง + ขอบมน + ไอคอนแดง) ---
export const InsufficientPointsModal = ({ isOpen, onClose }: InsufficientModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4"
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}
      >
         <div 
            className="bg-white p-8 pt-12 text-center shadow-2xl animate-scaleIn relative"
            style={{ 
              width: '100%', maxWidth: '380px',
              overflow: 'visible',
              border: '2px solid #FF3B30',
              borderRadius: '24px' // 👈 บังคับขอบมนตรงนี้
            }}
         >
            {/* ไอคอนลอย */}
            <div 
              className="absolute rounded-full flex items-center justify-center shadow-md"
              style={{
                width: '80px', height: '80px',
                backgroundColor: '#FF3B30', // แดง
                top: '-40px', left: '50%', transform: 'translateX(-50%)' 
              }}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            
            <div className="mt-4">
               <h3 className="text-xl font-bold text-slate-800 mb-8">แต้มของคุณไม่เพียงพอ</h3>
               <button 
                 onClick={onClose} 
                 className="text-white rounded-xl font-bold shadow-md hover:opacity-90 transition"
                 style={{ 
                   backgroundColor: '#00A86B', // ปุ่มเขียว
                   width: '100%', padding: '12px 40px' 
                 }}
               >
                 ตกลง
               </button>
            </div>
         </div>
      </div>
    </ModalPortal>
  );
};