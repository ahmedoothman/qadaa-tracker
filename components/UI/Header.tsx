'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: {
    displayName?: string | null;
    email?: string | null;
  } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-lg'>
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>
              As-salamu alaykum, {user.displayName || 'User'}!
            </h1>
            <p className='text-sm text-gray-600'>
              May Allah make it easy for you
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className='p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
          title='Logout'
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
