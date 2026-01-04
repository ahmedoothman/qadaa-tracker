'use client';

import React from 'react';
import { LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface HeaderProps {
  user: {
    displayName?: string | null;
    email?: string | null;
  } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const { t, language, setLanguage, isRTL } = useLanguage();

  if (!user) return null;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
      <div
        className={`flex items-center justify-between ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div
          className={`flex items-center gap-4 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <div className='w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-lg'>
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className='text-xl font-bold text-gray-800'>
              {t.header.greeting}, {user.displayName || 'User'}!
            </h1>
            <p className='text-sm text-gray-600'>{t.header.subtitle}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <button
            onClick={toggleLanguage}
            className='p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1'
            title={language === 'en' ? 'العربية' : 'English'}
          >
            <Globe size={20} />
            <span className='text-xs font-semibold'>
              {language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
          <button
            onClick={onLogout}
            className='p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
            title={t.header.logout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
