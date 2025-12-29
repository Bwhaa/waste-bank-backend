'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService, UserProfile } from '@/services/user.service';
import { authService } from '@/services/auth.service';

// Components
import { HomeHeader } from '@/components/home/HomeHeader';
import { MainMenu } from '@/components/home/MainMenu';
import { PrivilegesSection } from '@/components/home/PrivilegesSection';
import { NewsSection } from '@/components/home/NewsSection';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initPage = async () => {
      if (!authService.getAccessToken()) {
        router.replace('/login');
        return;
      }

      try {
        const profile = await userService.getProfile();
        setUser(profile);
        if (!profile.phone) router.replace('/register');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      {/* 🟢 Header ใหม่ */}
      <HomeHeader user={user} />

      {/* 📱 เมนูหลัก (มีปุ่มสรุปการใช้งานแล้ว) */}
      <MainMenu />

      {/* 🌟 สิทธิพิเศษ */}
      <PrivilegesSection />

      {/* 📰 ข่าวสาร */}
      <NewsSection />
    </div>
  );
}