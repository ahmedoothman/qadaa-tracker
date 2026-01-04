'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  calculateRamadans,
  validateDateRange,
  RamadanData,
} from '@/utils/calculations';
import DatePicker from '@/components/UI/DatePicker';
import { useLanguage } from '@/lib/i18n';

interface SiyamCalculatorProps {
  onCalculate: (ramadans: RamadanData[]) => void;
  onCancel: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const SiyamCalculator: React.FC<SiyamCalculatorProps> = ({
  onCalculate,
  onCancel,
  initialStartDate = '',
  initialEndDate = '',
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  const handleCalculate = () => {
    const validation = validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const ramadans = calculateRamadans(startDate, endDate);
    onCalculate(ramadans);
  };

  return (
    <div className='space-y-4'>
      <h3
        className={`text-lg font-semibold text-gray-800 flex items-center gap-2 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <Calendar className='text-amber-600' size={20} />
        {t.siyamCalculator.title}
      </h3>

      {error && (
        <div
          className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm ${
            isRTL ? 'text-right' : ''
          }`}
        >
          {error}
        </div>
      )}

      <DatePicker
        label={t.siyamCalculator.startYearLabel}
        value={startDate}
        onChange={(date) => {
          setStartDate(date);
          setError(null);
        }}
        color='amber'
      />

      <DatePicker
        label={t.siyamCalculator.endYearLabel}
        value={endDate}
        onChange={(date) => {
          setEndDate(date);
          setError(null);
        }}
        maxDate={new Date().toISOString().split('T')[0]}
        color='amber'
      />

      <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
        {t.siyamCalculator.hint}
      </p>

      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={onCancel}
          className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
        >
          {t.common.cancel}
        </button>
        <button
          onClick={handleCalculate}
          className='flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors'
        >
          {t.common.calculate}
        </button>
      </div>
    </div>
  );
};

export default SiyamCalculator;
