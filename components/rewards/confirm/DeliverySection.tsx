'use client';

import { useState } from 'react';
import { UserProfile } from '@/contexts/UserContext'; 

interface Props {
  deliveryMethod: 'pickup' | 'delivery';
  setDeliveryMethod: (method: 'pickup' | 'delivery') => void;
  user: UserProfile;
  updateUser: (user: UserProfile) => Promise<void>;
}

export const DeliverySection = ({ deliveryMethod, setDeliveryMethod, user, updateUser }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleSave = async () => {
    await updateUser(tempUser);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (!isEditing) setTempUser(user); 
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-3 text-lg">วิธีการรับสินค้า</h3>
      <div className="space-y-3">
        {/* ตัวเลือกรับเอง */}
        <div 
          onClick={() => setDeliveryMethod('pickup')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${deliveryMethod === 'pickup' ? 'border-[#00A86B] bg-[#00A86B]/5' : 'border-slate-100 bg-white'}`}
        >
           <div className="mt-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${deliveryMethod === 'pickup' ? 'bg-[#00A86B]' : 'border-2 border-slate-300'}`}>
                 {deliveryMethod === 'pickup' && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                 )}
              </div>
           </div>
           <div>
              <div className="font-bold text-slate-800">📍 รับเองที่จุดแลก</div>
              <p className="text-sm text-slate-500">ศูนย์รวมขยะชุมชนบางบัวทอง (ฟรี)</p>
           </div>
        </div>

        {/* ตัวเลือกจัดส่ง */}
        <div 
          onClick={() => setDeliveryMethod('delivery')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${deliveryMethod === 'delivery' ? 'border-[#00A86B] bg-[#00A86B]/5' : 'border-slate-100 bg-white'}`}
        >
           <div className="mt-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${deliveryMethod === 'delivery' ? 'bg-[#00A86B]' : 'border-2 border-slate-300'}`}>
                 {deliveryMethod === 'delivery' && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                 )}
              </div>
           </div>
           <div>
              <div className="font-bold text-slate-800">🚚 จัดส่งถึงบ้าน</div>
              <p className="text-sm text-slate-500">ค่าจัดส่ง 50 แต้ม</p>
              {/* ✅ เพิ่มข้อความตรงนี้ */}
              <p className="text-sm text-slate-500">ทำการจัดส่งภายใน 3-5 วัน</p>
           </div>
        </div>
      </div>

      {/* ส่วนแก้ไขที่อยู่ */}
      {deliveryMethod === 'delivery' && (
        <div className="mt-4 animate-fadeIn">
           <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-800">ที่อยู่จัดส่ง</h4>
              <button onClick={toggleEdit} className="text-sm text-[#00A86B] font-bold hover:underline">
                {isEditing ? 'ยกเลิก' : 'แก้ไข'}
              </button>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              {isEditing ? (
                 <div className="space-y-3">
                    <input className="w-full p-3 border rounded-xl" value={tempUser.name} onChange={e => setTempUser({...tempUser, name: e.target.value})} placeholder="ชื่อ-นามสกุล" />
                    <input className="w-full p-3 border rounded-xl" value={tempUser.phone} onChange={e => setTempUser({...tempUser, phone: e.target.value})} placeholder="เบอร์โทร" />
                    <textarea className="w-full p-3 border rounded-xl" rows={3} value={tempUser.address} onChange={e => setTempUser({...tempUser, address: e.target.value})} placeholder="ที่อยู่" />
                    <button onClick={handleSave} className="w-full bg-[#00A86B] text-white py-3 rounded-xl font-bold">บันทึก</button>
                 </div>
              ) : (
                 <div className="text-sm text-slate-700 space-y-1">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-slate-600">{user.phone}</p>
                    <p className="text-slate-600 pt-1">{user.address}</p>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};