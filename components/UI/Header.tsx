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
    <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6'>
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 ${
          isRTL ? 'sm:flex-row-reverse' : ''
        }`}
      >
        <div
          className={`flex items-center gap-3 sm:gap-4 w-full sm:w-auto ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0'>
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
          <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
            <h1 className='text-lg sm:text-xl font-bold text-gray-800 truncate'>
              {t.header.greeting}, {user.displayName || 'User'}!
            </h1>
            <p className='text-xs sm:text-sm text-gray-600 truncate'>{t.header.subtitle}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 w-full sm:w-auto justify-end ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <button
            onClick={toggleLanguage}
            className='p-2 sm:p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1'
            title={language === 'en' ? 'العربية' : 'English'}
          >
            <Globe size={18} className='sm:w-5 sm:h-5' />
            <span className='text-xs font-semibold'>
              {language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
          <button
            onClick={onLogout}
            className='p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
            title={t.header.logout}
          >
            <LogOut size={18} className='sm:w-5 sm:h-5' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
