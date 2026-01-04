'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';

export default function DirectionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    // Set direction immediately when language changes
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return <>{children}</>;
}
