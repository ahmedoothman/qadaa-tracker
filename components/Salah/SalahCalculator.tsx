'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { calculateDaysBetween, validateDateRange } from '@/utils/calculations';
import DatePicker from '@/components/UI/DatePicker';

interface SalahCalculatorProps {
  onCalculate: (result: {
    totalDays: number;
    startDate: string;
    endDate: string;
    menstrualDaysPerMonth: number;
  }) => void;
  onCancel: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
  initialMenstrualDays?: number;
}

const SalahCalculator: React.FC<SalahCalculatorProps> = ({
  onCalculate,
  onCancel,
  initialStartDate = '',
  initialEndDate = '',
  initialMenstrualDays = 0,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [menstrualDays, setMenstrualDays] = useState(initialMenstrualDays);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const validation = validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const result = calculateDaysBetween(startDate, endDate, menstrualDays);
    onCalculate({
      totalDays: result.total,
      startDate,
      endDate,
      menstrualDaysPerMonth: menstrualDays,
    });
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
        <Calendar className='text-teal-600' size={20} />
        Calculate Missed Prayer Days
      </h3>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <DatePicker
        label='Start Date (when you stopped praying)'
        value={startDate}
        onChange={(date) => {
          setStartDate(date);
          setError(null);
        }}
        color='teal'
      />

      <DatePicker
        label='End Date (when you resumed praying)'
        value={endDate}
        onChange={(date) => {
          setEndDate(date);
          setError(null);
        }}
        maxDate={new Date().toISOString().split('T')[0]}
        color='teal'
      />

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Menstrual Days per Month (optional, for sisters)
        </label>
        <input
          type='number'
          value={menstrualDays}
          onChange={(e) => setMenstrualDays(parseInt(e.target.value) || 0)}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none'
          placeholder='e.g., 7'
          min='0'
          max='15'
        />
        <p className='text-xs text-gray-500 mt-1'>
          These days will be excluded from your total as prayer is not
          obligatory during menstruation
        </p>
      </div>

      <div className='flex gap-3'>
        <button
          onClick={onCancel}
          className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
        >
          Cancel
        </button>
        <button
          onClick={handleCalculate}
          className='flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors'
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default SalahCalculator;
