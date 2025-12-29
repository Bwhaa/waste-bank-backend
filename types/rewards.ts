// รวม Type ทั้งหมดที่เกี่ยวกับ Rewards ไว้ที่นี่
export type RewardCategory = 'supply' | 'condiment' | 'municipal' | 'donation';

export interface RewardItem {
  id: number;
  name: string;
  desc: string;
  points: number;
  stock: number;
  image: string;
  category: RewardCategory; // ใช้ Type ที่เรากำหนด
  isPopular?: boolean;
}

export interface DonationItem {
  id: number;
  title: string;
  desc: string;
  minPoints: number;
  icon: string;
  color: string;
  btnColor: string;
  textColor: string;
}