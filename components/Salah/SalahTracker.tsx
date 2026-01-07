'use client';

import React, { useState } from 'react';
import { Sun, Calendar } from 'lucide-react';
import { ProgressCircle } from '@/components/UI/ProgressBar';
import SalahCalculator from './SalahCalculator';
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
}

interface SalahTrackerProps {
  salahData: SalahData;
  onUpdate: (data: SalahData) => void;
}

const SalahTracker: React.FC<SalahTrackerProps> = ({ salahData, onUpdate }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const { t, isRTL } = useLanguage();

  // Use props directly
  const totalDays = salahData?.totalDays || 0;
  const completed = salahData?.completedDays || 0;

  // Initialize prayer counters
  const prayerCounters = salahData?.prayerCounters || {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  };

  const prayers = [
    { name: 'Fajr', nameAr: 'الفجر', key: 'fajr' as const, color: 'purple' },
    { name: 'Dhuhr', nameAr: 'الظهر', key: 'dhuhr' as const, color: 'blue' },
    { name: 'Asr', nameAr: 'العصر', key: 'asr' as const, color: 'amber' },
    {
      name: 'Maghrib',
      nameAr: 'المغرب',
      key: 'maghrib' as const,
      color: 'orange',
    },
    { name: 'Isha', nameAr: 'العشاء', key: 'isha' as const, color: 'indigo' },
  ];

  // Check if all prayers have at least 1 count and convert to day
  const checkAndConvertToDay = (updatedCounters: typeof prayerCounters) => {
    const allHaveAtLeastOne = Object.values(updatedCounters).every(
      (count) => count >= 1
    );

    if (allHaveAtLeastOne) {
      // Reduce each counter by 1 and increase completed days by 1
      const newCounters = {
        fajr: updatedCounters.fajr - 1,
        dhuhr: updatedCounters.dhuhr - 1,
        asr: updatedCounters.asr - 1,
        maghrib: updatedCounters.maghrib - 1,
        isha: updatedCounters.isha - 1,
      };

      const newCompleted = Math.min(totalDays, completed + 1);

      onUpdate({
        ...salahData,
        completedDays: newCompleted,
        prayerCounters: newCounters,
      });

      // Recursively check if we can convert again
      setTimeout(() => checkAndConvertToDay(newCounters), 100);
    }
  };

  const handlePrayerIncrement = (
    prayerKey: keyof typeof prayerCounters,
    increment: number
  ) => {
    const newCount = Math.max(0, prayerCounters[prayerKey] + increment);
    const updatedCounters = {
      ...prayerCounters,
      [prayerKey]: newCount,
    };

    onUpdate({
      ...salahData,
      prayerCounters: updatedCounters,
    });

    // Check if we should convert to a day
    if (increment > 0) {
      setTimeout(() => checkAndConvertToDay(updatedCounters), 100);
    }
  };

  const handleCalculateResult = (result: {
    totalDays: number;
    startDate: string;
    endDate: string;
    menstrualDaysPerMonth: number;
  }) => {
    onUpdate({
      totalDays: result.totalDays,
      completedDays: completed,
      startDate: result.startDate,
      endDate: result.endDate,
      menstrualDaysPerMonth: result.menstrualDaysPerMonth,
    });
    setShowCalculator(false);
  };

  const handleManualUpdate = () => {
    const newTotal = parseInt(manualInput) || 0;
    onUpdate({
      ...salahData,
      totalDays: newTotal,
      completedDays: completed,
    });
    setManualInput('');
  };

  const handleProgress = (increment: number) => {
    const newCompleted = Math.max(
      0,
      Math.min(totalDays, completed + increment)
    );
    onUpdate({
      ...salahData,
      totalDays: totalDays,
      completedDays: newCompleted,
    });
  };

  const percentage = totalDays > 0 ? (completed / totalDays) * 100 : 0;
  const remaining = totalDays - completed;

  return (
    <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6'>
      <div
        className={`flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0'>
          <Sun className='text-teal-600' size={20} />
        </div>
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-800 truncate'>
            {t.salah.title}
          </h2>
          <p className='text-xs sm:text-sm text-gray-600 truncate'>
            {t.salah.subtitle}
          </p>
        </div>
      </div>

      {!showCalculator ? (
        <>
          <div className='flex justify-center mb-6'>
            <ProgressCircle percentage={percentage} />
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6'>
            <div className='text-center p-2 sm:p-0'>
              <p className='text-2xl sm:text-3xl font-bold text-teal-600'>
                {totalDays}
              </p>
              <p className='text-xs sm:text-sm text-gray-600'>
                {t.common.totalDays}
              </p>
            </div>
            <div className='text-center p-2 sm:p-0'>
              <p className='text-2xl sm:text-3xl font-bold text-green-600'>
                {completed}
              </p>
              <p className='text-xs sm:text-sm text-gray-600'>
                {t.common.completed}
              </p>
            </div>
            <div className='text-center p-2 sm:p-0 col-span-2 sm:col-span-1'>
              <p className='text-2xl sm:text-3xl font-bold text-gray-600'>
                {remaining}
              </p>
              <p className='text-xs sm:text-sm text-gray-600'>
                {t.common.remaining}
              </p>
            </div>
          </div>
          <div
            className={`mb-3 sm:mb-4 bg-teal-50 border border-teal-200 text-teal-800 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm ${
              isRTL ? 'text-right' : ''
            }`}
          >
            <p className='font-semibold mb-1'>{t.salah.proTipTitle}</p>
            <p className='leading-relaxed'>{t.salah.proTip}</p>
          </div>
          <div
            className={`grid grid-cols-2 sm:flex gap-2 sm:gap-3 mb-3 sm:mb-4 ${
              isRTL ? 'sm:flex-row-reverse' : ''
            }`}
          >
            <button
              onClick={() => handleProgress(-1)}
              className='flex-1 bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm sm:text-base min-h-[48px]'
            >
              {t.salah.minusOneDay}
            </button>
            <button
              onClick={() => handleProgress(1)}
              className='flex-1 bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors text-sm sm:text-base min-h-[48px]'
            >
              {t.salah.plusOneDay}
            </button>
            <button
              onClick={() => handleProgress(2)}
              className='col-span-2 sm:col-span-1 flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm sm:text-base min-h-[48px]'
            >
              {t.salah.plusTwoDays}
            </button>
          </div>

          {/* Prayer Counters */}
          <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
            <p className='text-xs text-gray-600 mb-2 text-center'>
              {isRTL ? '✨ 5 صلوات = يوم واحد' : '✨ 5 prayers = 1 day'}
            </p>
            <div className='space-y-2'>
              {prayers.map((prayer) => {
                const count = prayerCounters[prayer.key];

                return (
                  <div
                    key={prayer.key}
                    className={`flex items-center justify-center gap-3 ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span className='text-sm font-medium text-gray-700 w-16 flex-shrink-0 text-center'>
                      {isRTL ? prayer.nameAr : prayer.name}
                    </span>
                    <span className='text-lg font-bold text-teal-600 w-8 text-center'>
                      {count}
                    </span>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handlePrayerIncrement(prayer.key, -1)}
                        className='w-8 h-8 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm flex items-center justify-center'
                        disabled={count === 0}
                      >
                        −
                      </button>
                      <button
                        onClick={() => handlePrayerIncrement(prayer.key, 1)}
                        className='w-8 h-8 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-colors text-sm flex items-center justify-center'
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='space-y-2 sm:space-y-3'>
            <button
              onClick={() => setShowCalculator(true)}
              className={`w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Calendar size={18} className='sm:w-5 sm:h-5' />
              {t.common.useCalculator}
            </button>

            <div
              className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${
                isRTL ? 'sm:flex-row-reverse' : ''
              }`}
            >
              <input
                type='number'
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className={`flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base min-h-[48px] ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                placeholder={`${t.salah.currentPlaceholder} ${totalDays} ${t.common.days}`}
                min='0'
              />
              <button
                onClick={handleManualUpdate}
                className='w-full sm:w-auto px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm sm:text-base min-h-[48px]'
              >
                {t.common.update}
              </button>
            </div>
          </div>

          {percentage >= 100 && (
            <div
              className={`mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center ${
                isRTL ? 'text-right' : ''
              }`}
            >
              {t.salah.completionMessage}
            </div>
          )}
        </>
      ) : (
        <SalahCalculator
          onCalculate={handleCalculateResult}
          onCancel={() => setShowCalculator(false)}
          initialStartDate={salahData?.startDate || ''}
          initialEndDate={salahData?.endDate || ''}
          initialMenstrualDays={salahData?.menstrualDaysPerMonth || 0}
        />
      )}
    </div>
  );
};

export default SalahTracker;
