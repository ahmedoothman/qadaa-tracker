'use client';

import React, { useState } from 'react';
import { Moon, Calendar, Plus, Trash2 } from 'lucide-react';
import { ProgressCircle } from '@/components/UI/ProgressBar';
import SiyamCalculator from './SiyamCalculator';
import { RamadanData } from '@/utils/calculations';
import { useLanguage } from '@/lib/i18n';

interface SiyamData {
  totalDays: number;
  completedDays: number;
  ramadans: RamadanData[]; // For informational purposes only
}

interface SiyamTrackerProps {
  siyamData: SiyamData;
  onUpdate: (data: SiyamData) => void;
}

const SiyamTracker: React.FC<SiyamTrackerProps> = ({ siyamData, onUpdate }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newDays, setNewDays] = useState(30);
  const { t, isRTL, language } = useLanguage();

  // Use props directly
  const ramadans = siyamData?.ramadans || [];
  const totalDays = siyamData?.totalDays || 0;
  const completedDays = siyamData?.completedDays || 0;

  const handleCalculateResult = (calculatedRamadans: RamadanData[]) => {
    const newTotalDays = calculatedRamadans.reduce(
      (sum, r) => sum + r.totalDays,
      0
    );
    onUpdate({
      totalDays: newTotalDays,
      completedDays: 0, // Reset completed days when recalculating
      ramadans: calculatedRamadans,
    });
    setShowCalculator(false);
  };

  const updateCompleted = (increment: number) => {
    const newCompleted = Math.max(
      0,
      Math.min(totalDays, completedDays + increment)
    );
    onUpdate({
      totalDays,
      completedDays: newCompleted,
      ramadans,
    });
  };

  const addRamadan = () => {
    // Check if year already exists
    if (ramadans.some((r) => r.gregorianYear === newYear)) {
      alert(t.siyam.yearAlreadyExists);
      return;
    }

    const updated = [
      ...ramadans,
      {
        year: 0, // Hijri year - not used for manual entry
        gregorianYear: newYear,
        startDate: '',
        endDate: '',
        totalDays: newDays,
        completedDays: 0,
      },
    ];
    updated.sort((a, b) => a.gregorianYear - b.gregorianYear);
    const newTotalDays = updated.reduce((sum, r) => sum + r.totalDays, 0);
    onUpdate({
      totalDays: newTotalDays,
      completedDays,
      ramadans: updated,
    });
    setShowAddYear(false);
    setNewYear(new Date().getFullYear());
    setNewDays(30);
  };

  const removeRamadan = (index: number) => {
    if (confirm(t.siyam.confirmRemove)) {
      const updated = ramadans.filter((_, i) => i !== index);
      const newTotalDays = updated.reduce((sum, r) => sum + r.totalDays, 0);
      const newCompleted = Math.min(completedDays, newTotalDays);
      onUpdate({
        totalDays: newTotalDays,
        completedDays: newCompleted,
        ramadans: updated,
      });
    }
  };

  const percentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div
        className={`flex items-center gap-3 mb-6 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div className='w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center'>
          <Moon className='text-amber-600' size={24} />
        </div>
        <div className={isRTL ? 'text-right' : ''}>
          <h2 className='text-2xl font-bold text-gray-800'>{t.siyam.title}</h2>
          <p className='text-sm text-gray-600'>{t.siyam.subtitle}</p>
        </div>
      </div>

      {showCalculator ? (
        <SiyamCalculator
          onCalculate={handleCalculateResult}
          onCancel={() => setShowCalculator(false)}
        />
      ) : showAddYear ? (
        <div className='space-y-4'>
          <h3
            className={`text-lg font-semibold text-gray-800 ${
              isRTL ? 'text-right' : ''
            }`}
          >
            {t.siyam.addRamadanYear}
          </h3>

          <div>
            <label
              className={`block text-sm font-semibold text-gray-700 mb-2 ${
                isRTL ? 'text-right' : ''
              }`}
            >
              {t.common.year}
            </label>
            <input
              type='number'
              value={newYear}
              onChange={(e) =>
                setNewYear(parseInt(e.target.value) || new Date().getFullYear())
              }
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              min='1900'
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-semibold text-gray-700 mb-2 ${
                isRTL ? 'text-right' : ''
              }`}
            >
              {t.common.daysMissed}
            </label>
            <input
              type='number'
              value={newDays}
              onChange={(e) =>
                setNewDays(
                  Math.min(30, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              min='1'
              max='30'
            />
          </div>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setShowAddYear(false)}
              className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
            >
              {t.common.cancel}
            </button>
            <button
              onClick={addRamadan}
              className='flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors'
            >
              {t.common.add}
            </button>
          </div>
        </div>
      ) : ramadans.length > 0 ? (
        <>
          <div className='flex justify-center mb-6'>
            <ProgressCircle percentage={percentage} color='#D97706' />
          </div>

          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div className='text-center'>
              <p className='text-3xl font-bold text-amber-600'>{totalDays}</p>
              <p className='text-sm text-gray-600'>{t.common.totalDays}</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-green-600'>
                {completedDays}
              </p>
              <p className='text-sm text-gray-600'>{t.common.completed}</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-gray-600'>
                {totalDays - completedDays}
              </p>
              <p className='text-sm text-gray-600'>{t.common.remaining}</p>
            </div>
          </div>

          <div className={`flex gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => updateCompleted(-1)}
              className='px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-lg'
            >
              -
            </button>
            <div className='flex-1 bg-gray-100 rounded-lg px-4 py-3 text-center font-bold text-xl'>
              {completedDays} {t.siyam.daysCompleted}
            </div>
            <button
              onClick={() => updateCompleted(1)}
              className='px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-lg'
            >
              +
            </button>
          </div>

          <div className='border-t pt-4 mb-4'>
            <div
              className={`flex items-center justify-between ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <h3 className='text-sm font-semibold text-gray-700'>
                {t.siyam.ramadanHistory}
              </h3>
              <span className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold'>
                {ramadans.length}{' '}
                {ramadans.length !== 1 ? t.siyam.ramadans : t.siyam.ramadan}
              </span>
            </div>
          </div>

          <div className='space-y-3 mb-4 max-h-80 overflow-y-auto'>
            {ramadans.map((ramadan, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-3 bg-gray-50'
              >
                <div
                  className={`flex justify-between items-center ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className='font-semibold text-gray-800 text-sm'>
                      {t.siyam.ramadan} {ramadan.year} AH (
                      {ramadan.gregorianYear} CE)
                    </h3>
                    {ramadan.startDate && (
                      <p className='text-xs text-gray-500'>
                        {new Date(ramadan.startDate).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-GB'
                        )}{' '}
                        -{' '}
                        {new Date(ramadan.endDate).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-GB'
                        )}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span className='text-sm text-gray-600 font-medium'>
                      {ramadan.totalDays} {t.common.days}
                    </span>
                    <button
                      onClick={() => removeRamadan(index)}
                      className='p-1 text-red-500 hover:text-red-700 transition-colors'
                      title={t.common.remove}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setShowAddYear(true)}
              className={`flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Plus size={20} />
              {t.common.addYear}
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className={`flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Calendar size={20} />
              {t.common.recalculate}
            </button>
          </div>

          {percentage >= 100 && (
            <div
              className={`mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center ${
                isRTL ? 'text-right' : ''
              }`}
            >
              {t.siyam.completionMessage}
            </div>
          )}
        </>
      ) : (
        <div className='space-y-4'>
          <p
            className={`text-gray-600 text-center py-4 ${
              isRTL ? 'text-right' : ''
            }`}
          >
            {t.siyam.noRamadansYet}
          </p>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setShowAddYear(true)}
              className={`flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Plus size={20} />
              {t.common.addYear}
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className={`flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Calendar size={20} />
              {t.common.useCalculator}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiyamTracker;
