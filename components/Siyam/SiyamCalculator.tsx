'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  calculateRamadans,
  validateDateRange,
  RamadanData,
} from '@/utils/calculations';
import DatePicker from '@/components/UI/DatePicker';

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
      <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
        <Calendar className='text-amber-600' size={20} />
        Calculate Missed Ramadan Fasts
      </h3>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <DatePicker
        label='Start Year (first missed Ramadan)'
        value={startDate}
        onChange={(date) => {
          setStartDate(date);
          setError(null);
        }}
        color='amber'
      />

      <DatePicker
        label='End Year (last missed Ramadan)'
        value={endDate}
        onChange={(date) => {
          setEndDate(date);
          setError(null);
        }}
        maxDate={new Date().toISOString().split('T')[0]}
        color='amber'
      />

      <p className='text-sm text-gray-500'>
        This will calculate total missed Ramadan fasts between the dates. The
        Ramadan years will be shown for reference only.
      </p>

      <div className='flex gap-3'>
        <button
          onClick={onCancel}
          className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
        >
          Cancel
        </button>
        <button
          onClick={handleCalculate}
          className='flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors'
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default SiyamCalculator;
