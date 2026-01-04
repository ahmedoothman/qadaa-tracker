'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon } from 'lucide-react';
import { onAuthChange } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Moon className='w-16 h-16 text-teal-600 animate-pulse mx-auto mb-4' />
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
