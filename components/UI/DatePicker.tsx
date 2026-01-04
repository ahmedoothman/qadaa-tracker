'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  maxDate?: string;
  minDate?: string;
  color?: 'teal' | 'amber';
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  maxDate,
  minDate,
  color = 'teal',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');

  // Parse current value or default to today
  const parseDate = (dateStr: string) => {
    if (dateStr) {
      const d = new Date(dateStr);
      return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
    }
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
  };

  const currentDate = parseDate(value);
  const [viewYear, setViewYear] = useState(currentDate.year);
  const [viewMonth, setViewMonth] = useState(currentDate.month);

  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayClick = (day: number) => {
    const selected = formatDate(viewYear, viewMonth, day);
    onChange(selected);
    setShowPicker(false);
  };

  const handleMonthClick = (month: number) => {
    setViewMonth(month);
    setViewMode('day');
  };

  const handleYearClick = (year: number) => {
    setViewYear(year);
    setViewMode('month');
  };

  const renderDayView = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days = [];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className='p-2'></div>);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(viewYear, viewMonth, day);
      const isSelected = value === dateStr;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const isDisabled =
        !!(maxDate && dateStr > maxDate) || !!(minDate && dateStr < minDate);

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDayClick(day)}
          disabled={isDisabled}
          className={`
            p-2 text-sm rounded-lg transition-colors
            ${isSelected ? `bg-${color}-600 text-white font-semibold` : ''}
            ${
              !isSelected && isToday
                ? `border-2 border-${color}-600 text-${color}-600`
                : ''
            }
            ${!isSelected && !isToday && !isDisabled ? 'hover:bg-gray-100' : ''}
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <>
        <div className='grid grid-cols-7 gap-1 mb-2'>
          {weekDays.map((day) => (
            <div
              key={day}
              className='text-center text-xs font-semibold text-gray-600 p-2'
            >
              {day}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-7 gap-1'>{days}</div>
      </>
    );
  };

  const renderMonthView = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return (
      <div className='grid grid-cols-3 gap-2'>
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={`
              p-3 text-sm rounded-lg transition-colors
              ${
                viewMonth === index
                  ? `bg-${color}-600 text-white font-semibold`
                  : 'hover:bg-gray-100'
              }
            `}
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;
    const years = [];

    for (let i = 0; i < 12; i++) {
      const year = viewYear - 6 + i;
      years.push(
        <button
          key={year}
          onClick={() => handleYearClick(year)}
          className={`
            p-3 text-sm rounded-lg transition-colors
            ${
              viewYear === year
                ? `bg-${color}-600 text-white font-semibold`
                : 'hover:bg-gray-100'
            }
          `}
        >
          {year}
        </button>
      );
    }

    return <div className='grid grid-cols-3 gap-2'>{years}</div>;
  };

  const navigateMonth = (direction: number) => {
    let newMonth = viewMonth + direction;
    let newYear = viewYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const colorClasses = {
    teal: {
      border: 'focus:ring-teal-500 focus:border-teal-500',
      bg: 'bg-teal-600',
      hover: 'hover:bg-teal-700',
    },
    amber: {
      border: 'focus:ring-amber-500 focus:border-amber-500',
      bg: 'bg-amber-600',
      hover: 'hover:bg-amber-700',
    },
  };

  return (
    <div className='relative'>
      <label className='block text-sm font-semibold text-gray-700 mb-2'>
        {label}
      </label>
      <button
        type='button'
        onClick={() => setShowPicker(!showPicker)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 outline-none transition-colors ${
          colorClasses[color].border
        } ${showPicker ? 'ring-2' : ''}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDisplay(value)}
        </span>
      </button>

      {showPicker && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setShowPicker(false)}
          ></div>
          <div className='absolute z-20 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-full md:w-80'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
              <button
                type='button'
                onClick={() => {
                  if (viewMode === 'day') navigateMonth(-1);
                  else if (viewMode === 'month') setViewYear(viewYear - 1);
                  else setViewYear(viewYear - 12);
                }}
                className='p-1 hover:bg-gray-100 rounded'
              >
                <ChevronLeft size={20} />
              </button>

              <div className='flex gap-2'>
                {viewMode === 'day' && (
                  <>
                    <button
                      type='button'
                      onClick={() => setViewMode('month')}
                      className='font-semibold hover:bg-gray-100 px-2 py-1 rounded'
                    >
                      {monthNames[viewMonth]}
                    </button>
                    <button
                      type='button'
                      onClick={() => setViewMode('year')}
                      className='font-semibold hover:bg-gray-100 px-2 py-1 rounded'
                    >
                      {viewYear}
                    </button>
                  </>
                )}
                {viewMode === 'month' && (
                  <button
                    type='button'
                    onClick={() => setViewMode('year')}
                    className='font-semibold hover:bg-gray-100 px-2 py-1 rounded'
                  >
                    {viewYear}
                  </button>
                )}
                {viewMode === 'year' && (
                  <div className='font-semibold px-2 py-1'>
                    {viewYear - 6} - {viewYear + 5}
                  </div>
                )}
              </div>

              <button
                type='button'
                onClick={() => {
                  if (viewMode === 'day') navigateMonth(1);
                  else if (viewMode === 'month') setViewYear(viewYear + 1);
                  else setViewYear(viewYear + 12);
                }}
                className='p-1 hover:bg-gray-100 rounded'
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Content */}
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'year' && renderYearView()}

            {/* Today button */}
            <div className='mt-4 pt-3 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => {
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0];
                  if (!maxDate || todayStr <= maxDate) {
                    onChange(todayStr);
                    setShowPicker(false);
                  }
                }}
                className={`w-full py-2 text-sm ${colorClasses[color].bg} text-white rounded-lg font-semibold ${colorClasses[color].hover} transition-colors`}
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
