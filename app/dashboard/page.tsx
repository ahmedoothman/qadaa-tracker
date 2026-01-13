'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon } from 'lucide-react';
import { onAuthChange, logOut } from '@/lib/firebase';
import { getUserData, setUserData, trackVisit } from '@/lib/firestore';
import Header from '@/components/UI/Header';
import SalahTracker from '@/components/Salah/SalahTracker';
import SiyamTracker from '@/components/Siyam/SiyamTracker';
import type { User } from 'firebase/auth';
import { RamadanData } from '@/utils/calculations';
import { useLanguage } from '@/lib/i18n';

interface SalahData {
  totalDays: number;
  completedDays: number;
  startDate?: string | null;
  endDate?: string | null;
  menstrualDaysPerMonth?: number;
  prayerCounters?: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  firstIncreaseAt?: string | null;
  lastIncreaseAt?: string | null;
}

interface SiyamData {
  totalDays: number;
  completedDays: number;
  ramadans: RamadanData[]; // For informational purposes only
  firstIncreaseAt?: string | null;
  lastIncreaseAt?: string | null;
}

interface UserData {
  salah: SalahData;
  siyam: SiyamData;
}

const defaultUserData: UserData = {
  salah: {
    totalDays: 0,
    completedDays: 0,
    startDate: null,
    endDate: null,
    menstrualDaysPerMonth: 0,
    prayerCounters: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
    firstIncreaseAt: null,
    lastIncreaseAt: null,
  },
  siyam: {
    totalDays: 0,
    completedDays: 0,
    ramadans: [],
    firstIncreaseAt: null,
    lastIncreaseAt: null,
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserDataState] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser: User | null) => {
      if (authUser) {
        setUser(authUser);

        // Fetch user data from Firestore
        const { data } = await getUserData(authUser.uid);
        if (data) {
          setUserDataState({
            salah: data.salah || defaultUserData.salah,
            siyam: data.siyam || defaultUserData.siyam,
          });
        }

        // Track visit
        await trackVisit();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSalahUpdate = async (salahData: SalahData) => {
    if (!user) return;

    const newData = { ...userData, salah: salahData };
    setUserDataState(newData);
    await setUserData(user.uid, newData);
  };

  const handleSiyamUpdate = async (siyamData: SiyamData) => {
    if (!user) return;

    const newData = { ...userData, siyam: siyamData };
    setUserDataState(newData);
    await setUserData(user.uid, newData);
  };

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Moon className='w-16 h-16 text-teal-600 animate-pulse mx-auto mb-4' />
          <p className='text-gray-600'>{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-4xl mx-auto p-3 sm:p-4 pb-16 sm:pb-20'>
        <Header user={user} onLogout={handleLogout} />

        <SalahTracker salahData={userData.salah} onUpdate={handleSalahUpdate} />

        <SiyamTracker siyamData={userData.siyam} onUpdate={handleSiyamUpdate} />

        <div
          className={`text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 px-2 ${
            isRTL ? 'text-right' : ''
          }`}
        >
          <p className='mb-2 leading-relaxed'>{t.dashboard.footerMessage}</p>
          <p className='text-xs'>{t.dashboard.ameen}</p>
        </div>
      </div>
    </div>
  );
}
