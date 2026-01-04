'use client';

import React, { useState } from 'react';
import { Moon, Calendar, Plus, Trash2 } from 'lucide-react';
import { ProgressCircle } from '@/components/UI/ProgressBar';
import SiyamCalculator from './SiyamCalculator';
import { RamadanData } from '@/utils/calculations';

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
      alert('This year already exists in your list');
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
    if (confirm('Are you sure you want to remove this Ramadan?')) {
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
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center'>
          <Moon className='text-amber-600' size={24} />
        </div>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Qadaa Siyam</h2>
          <p className='text-sm text-gray-600'>Missed Fasting Tracker</p>
        </div>
      </div>

      {showCalculator ? (
        <SiyamCalculator
          onCalculate={handleCalculateResult}
          onCancel={() => setShowCalculator(false)}
        />
      ) : showAddYear ? (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Add Ramadan Year
          </h3>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Year
            </label>
            <input
              type='number'
              value={newYear}
              onChange={(e) =>
                setNewYear(parseInt(e.target.value) || new Date().getFullYear())
              }
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none'
              min='1900'
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Days Missed
            </label>
            <input
              type='number'
              value={newDays}
              onChange={(e) =>
                setNewDays(
                  Math.min(30, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none'
              min='1'
              max='30'
            />
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setShowAddYear(false)}
              className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={addRamadan}
              className='flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors'
            >
              Add
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
              <p className='text-sm text-gray-600'>Total Days</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-green-600'>
                {completedDays}
              </p>
              <p className='text-sm text-gray-600'>Completed</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-gray-600'>
                {totalDays - completedDays}
              </p>
              <p className='text-sm text-gray-600'>Remaining</p>
            </div>
          </div>

          <div className='flex gap-2 mb-6'>
            <button
              onClick={() => updateCompleted(-1)}
              className='px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-lg'
            >
              -
            </button>
            <div className='flex-1 bg-gray-100 rounded-lg px-4 py-3 text-center font-bold text-xl'>
              {completedDays} days completed
            </div>
            <button
              onClick={() => updateCompleted(1)}
              className='px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-lg'
            >
              +
            </button>
          </div>

          <div className='border-t pt-4 mb-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-gray-700'>
                Ramadan History (Info Only)
              </h3>
              <span className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold'>
                {ramadans.length} Ramadan{ramadans.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className='space-y-3 mb-4 max-h-80 overflow-y-auto'>
            {ramadans.map((ramadan, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-3 bg-gray-50'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='font-semibold text-gray-800 text-sm'>
                      Ramadan {ramadan.year} AH ({ramadan.gregorianYear} CE)
                    </h3>
                    {ramadan.startDate && (
                      <p className='text-xs text-gray-500'>
                        {new Date(ramadan.startDate).toLocaleDateString(
                          'en-GB'
                        )}{' '}
                        -{' '}
                        {new Date(ramadan.endDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600 font-medium'>
                      {ramadan.totalDays} days
                    </span>
                    <button
                      onClick={() => removeRamadan(index)}
                      className='p-1 text-red-500 hover:text-red-700 transition-colors'
                      title='Remove'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setShowAddYear(true)}
              className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2'
            >
              <Plus size={20} />
              Add Year
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className='flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2'
            >
              <Calendar size={20} />
              Recalculate
            </button>
          </div>

          {percentage >= 100 && (
            <div className='mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center'>
              🎉 MashaAllah! You have completed all your Qadaa Siyam!
            </div>
          )}
        </>
      ) : (
        <div className='space-y-4'>
          <p className='text-gray-600 text-center py-4'>
            No Ramadan fasts tracked yet. Use the calculator to get started or
            add years manually.
          </p>

          <div className='flex gap-3'>
            <button
              onClick={() => setShowAddYear(true)}
              className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2'
            >
              <Plus size={20} />
              Add Year
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className='flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2'
            >
              <Calendar size={20} />
              Use Calculator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiyamTracker;
