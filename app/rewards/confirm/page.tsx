'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/contexts/CartContext'; 
import { useUser } from '@/contexts/UserContext';
import { DateOption } from '@/components/rewards/RedeemOptions'; 
import { DeliverySection } from '@/components/rewards/confirm/DeliverySection';
// ✅ Import Modal ใหม่เพิ่มเข้ามา
import { ConfirmRedemptionModal, SuccessRedemptionModal, InsufficientPointsModal } from '@/components/rewards/confirm/RedeemModals';

interface CartItemDetail extends CartItem {
  id: number; name: string; desc: string; image: string; points: number;
}

export default function ConfirmRedemptionPage() {
  const router = useRouter();
  const { cart, totalPoints, removeFromCart, decreaseCart, addToCart } = useCart();
  const { user, updateUser } = useUser();
  const cartItems = cart as unknown as CartItemDetail[];
  
  // State
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // ✅ เพิ่ม State สำหรับ Modal แต้มไม่พอ
  const [showError, setShowError] = useState(false);

  // Date Logic
  const next5Days = useMemo(() => Array.from({ length: 5 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i + 1); return d;
  }), []);
  
  const [selectedDate, setSelectedDate] = useState<Date>(next5Days[0]); 

  // Calculations
  const deliveryFee = deliveryMethod === 'delivery' ? 50 : 0;
  const grandTotal = totalPoints + deliveryFee;
  const USER_POINTS = 2450; // Mock Points
  const remainingPoints = USER_POINTS - grandTotal; 

  const dateStr = deliveryMethod === 'pickup' 
    ? selectedDate?.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'ภายใน 3-5 วันทำการ';

  // ✅ ฟังก์ชันตรวจสอบก่อนยืนยัน
  const handleConfirmClick = () => {
    if (remainingPoints < 0) {
      setShowError(true); // ถ้าแต้มติดลบ ให้โชว์ Error Modal
    } else {
      setShowConfirm(true); // ถ้าแต้มพอ ให้โชว์ Confirm Modal
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-40 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full transition text-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800">ยืนยันการแลก</h1>
      </div>

      <div className="px-6 mt-4 space-y-6">
        {/* Banner Points */}
        {/* เปลี่ยนสี Banner ถ้าแต้มติดลบ (Optional - เพื่อความชัดเจน) */}
        <div className={`rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-colors duration-300 ${remainingPoints < 0 ? 'bg-red-500' : 'bg-[#00A86B]'}`}>
            <p className={`relative z-10 text-sm ${remainingPoints < 0 ? 'text-red-100' : 'text-green-100'}`}>แต้มคงเหลือหลังแลก</p>
            <h2 className="relative z-10 text-4xl font-bold">{remainingPoints.toLocaleString()} แต้ม</h2>
        </div>

        {/* 📦 Cart Items */}
        <div>
           <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-lg">
              <span className="text-green-500">🎁</span> รายการที่เลือก
           </h3>
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                         {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-800 text-base truncate">{item.name}</h4>
                         <p className="text-[#00A86B] font-bold text-sm mt-1">{item.points.toLocaleString()} แต้ม</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                             <button onClick={() => decreaseCart(item.id)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-red-500 active:scale-95 transition">-</button>
                             <span className="font-bold text-slate-800 text-sm w-4 text-center">{item.quantity}</span>
                             <button onClick={() => addToCart(item)} className="w-7 h-7 flex items-center justify-center bg-[#00A86B] rounded-md shadow-sm text-white hover:bg-green-600 active:scale-95 transition">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                      </div>
                  </div>
              ))}
              {cart.length === 0 && <div className="text-center py-8 px-4"><div className="text-4xl mb-2">🛒</div><p className="text-slate-400">ยังไม่มีสินค้าในตะกร้า</p></div>}
           </div>
        </div>

        {/* 🚚 Delivery Section */}
        <DeliverySection 
            deliveryMethod={deliveryMethod} 
            setDeliveryMethod={setDeliveryMethod} 
            user={user} 
            updateUser={updateUser} 
        />

        {/* 📅 Date Selection */}
        {deliveryMethod === 'pickup' && (
          <div className="animate-fadeIn">
             <h3 className="font-bold text-slate-800 mb-3 text-lg">📅 วันที่รับสินค้า</h3>
             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {next5Days.map(d => (
                  <DateOption key={d.toISOString()} date={d} active={selectedDate?.getDate() === d.getDate()} onClick={() => setSelectedDate(d)} />
                ))}
             </div>
          </div>
        )}

        {/* Summary & Button */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between mb-2 text-sm text-slate-500"><span>แต้มสินค้า</span><span>{totalPoints.toLocaleString()}</span></div>
            {deliveryMethod === 'delivery' && <div className="flex justify-between mb-2 text-sm text-blue-500"><span>ค่าส่ง</span><span>{deliveryFee}</span></div>}
            <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg text-slate-800"><span>รวม</span><span className="text-[#00A86B]">{grandTotal.toLocaleString()}</span></div>
        </div>
        
        {/* ✅ เปลี่ยน onClick เป็น handleConfirmClick */}
        <button 
          onClick={handleConfirmClick} 
          disabled={cart.length === 0} 
          className="w-full bg-[#00A86B] text-white py-4 rounded-2xl font-bold shadow-lg disabled:bg-slate-300 active:scale-95 transition"
        >
           🎁 ยืนยันการแลก
        </button>
      </div>

      {/* 🟢 Modals */}
      <ConfirmRedemptionModal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)} 
        onConfirm={() => { setShowConfirm(false); setShowSuccess(true); }}
        totalPoints={grandTotal}
        dateStr={dateStr || ''}
      />
      
      <SuccessRedemptionModal 
        isOpen={showSuccess} 
        onClose={() => router.push('/rewards')} 
        dateStr={dateStr || ''}
      />

      {/* ✅ เรียกใช้ Modal แจ้งเตือนแต้มไม่พอ */}
      <InsufficientPointsModal 
        isOpen={showError} 
        onClose={() => setShowError(false)} 
      />
    </div>
  );
}