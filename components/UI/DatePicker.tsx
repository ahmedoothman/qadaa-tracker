'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

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
  const { t, isRTL, language } = useLanguage();

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
    if (!dateStr) return t.datePicker.selectDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
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
    const weekDays = t.datePicker.weekDays;

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

      const selectedClass =
        color === 'teal'
          ? 'bg-teal-600 text-white font-semibold shadow-sm'
          : 'bg-amber-500 text-white font-semibold shadow-sm';

      const todayClass =
        color === 'teal'
          ? 'border-2 border-teal-500 text-teal-600'
          : 'border-2 border-amber-500 text-amber-600';

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDayClick(day)}
          disabled={isDisabled}
          className={`
            p-2 text-sm rounded-lg transition-all duration-200
            ${isSelected ? selectedClass : ''}
            ${!isSelected && isToday ? todayClass : ''}
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
        <div
          className={`grid grid-cols-7 gap-1 mb-2 ${
            isRTL ? 'direction-rtl' : ''
          }`}
        >
          {weekDays.map((day) => (
            <div
              key={day}
              className='text-center text-xs font-medium text-gray-500 p-2'
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
    const shortMonths =
      language === 'ar'
        ? [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ]
        : [
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

    const selectedClass =
      color === 'teal'
        ? 'bg-teal-600 text-white font-semibold'
        : 'bg-amber-500 text-white font-semibold';

    return (
      <div className='grid grid-cols-3 gap-2'>
        {shortMonths.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={`
              p-3 text-sm rounded-lg transition-all duration-200
              ${viewMonth === index ? selectedClass : 'hover:bg-gray-100'}
            `}
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const years = [];

    const selectedClass =
      color === 'teal'
        ? 'bg-teal-600 text-white font-semibold'
        : 'bg-amber-500 text-white font-semibold';

    for (let i = 0; i < 12; i++) {
      const year = viewYear - 6 + i;
      years.push(
        <button
          key={year}
          onClick={() => handleYearClick(year)}
          className={`
            p-3 text-sm rounded-lg transition-all duration-200
            ${viewYear === year ? selectedClass : 'hover:bg-gray-100'}
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

  const monthNames = t.datePicker.months;

  const colorClasses = {
    teal: {
      ring: 'focus:ring-teal-500 focus:border-teal-500',
      bg: 'bg-teal-600',
      hover: 'hover:bg-teal-700',
    },
    amber: {
      ring: 'focus:ring-amber-500 focus:border-amber-500',
      bg: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
    },
  };

  return (
    <div className='relative'>
      <label
        className={`block text-sm font-medium text-gray-700 mb-1 ${
          isRTL ? 'text-right' : ''
        }`}
      >
        {label}
      </label>
      <button
        type='button'
        onClick={() => setShowPicker(!showPicker)}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 text-sm ${
          colorClasses[color].ring
        } ${showPicker ? 'ring-2' : ''} ${isRTL ? 'text-right' : ''}`}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {formatDisplay(value)}
        </span>
      </button>

      {showPicker && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setShowPicker(false)}
          ></div>
          <div className='absolute z-20 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full md:w-80'>
            {/* Header */}
            <div
              className={`flex items-center justify-between mb-4 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <button
                type='button'
                onClick={() => {
                  if (viewMode === 'day') navigateMonth(isRTL ? 1 : -1);
                  else if (viewMode === 'month') setViewYear(viewYear - 1);
                  else setViewYear(viewYear - 12);
                }}
                className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <ChevronLeft size={18} />
              </button>

              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {viewMode === 'day' && (
                  <>
                    <button
                      type='button'
                      onClick={() => setViewMode('month')}
                      className='font-medium hover:bg-gray-100 px-2 py-1 rounded-lg text-sm transition-colors'
                    >
                      {monthNames[viewMonth]}
                    </button>
                    <button
                      type='button'
                      onClick={() => setViewMode('year')}
                      className='font-medium hover:bg-gray-100 px-2 py-1 rounded-lg text-sm transition-colors'
                    >
                      {viewYear}
                    </button>
                  </>
                )}
                {viewMode === 'month' && (
                  <button
                    type='button'
                    onClick={() => setViewMode('year')}
                    className='font-medium hover:bg-gray-100 px-2 py-1 rounded-lg text-sm transition-colors'
                  >
                    {viewYear}
                  </button>
                )}
                {viewMode === 'year' && (
                  <div className='font-medium px-2 py-1 text-sm'>
                    {viewYear - 6} - {viewYear + 5}
                  </div>
                )}
              </div>

              <button
                type='button'
                onClick={() => {
                  if (viewMode === 'day') navigateMonth(isRTL ? -1 : 1);
                  else if (viewMode === 'month') setViewYear(viewYear + 1);
                  else setViewYear(viewYear + 12);
                }}
                className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <ChevronRight size={18} />
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
                className={`w-full py-2 text-sm ${colorClasses[color].bg} text-white rounded-lg font-medium ${colorClasses[color].hover} transition-colors`}
              >
                {language === 'ar' ? 'اليوم' : 'Today'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
