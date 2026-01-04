'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/Auth/AuthForm';
import { onAuthChange } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return <AuthForm onSuccess={handleSuccess} />;
}
