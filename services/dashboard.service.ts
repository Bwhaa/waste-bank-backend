import { fetchAPI } from '@/lib/api-client';

export interface DashboardStats {
  summary: {
    totalWeight: number;
    totalPoints: number;
    totalMembers: number;
    activeMembers: number;
  };
  wasteChart: {
    name: string;
    amount: number;
  }[];
}

export const dashboardService = {
  getStats: async () => {
    // สั้น กระชับ อ่านง่าย
    return fetchAPI<DashboardStats>('/dashboard/stats');
  },
};