'use client';

import React, { useId } from 'react';
import {
  History,
  Trash2,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type HistoryActionType =
  | 'day_increment'
  | 'day_decrement'
  | 'prayer_increment'
  | 'prayer_decrement'
  | 'auto_convert_day';

export interface HistoryLogEntry {
  id: string;
  timestamp: string;
  action: HistoryActionType;
  delta: number;
  prayer?: PrayerKey;
  completedAfter: number;
  prayerCountAfter?: number;
}

interface HistoryLogProps {
  logs: HistoryLogEntry[];
  saveHistory: boolean;
  onToggleSaveHistory: (enabled: boolean) => void;
  onClearHistory: () => void;
  accentColor?: 'teal' | 'amber';
}

const formatLogTimestamp = (
  dateString: string,
  language: string
): { date: string; day: string } => {
  const date = new Date(dateString);
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const dayName = date.toLocaleDateString(locale, { weekday: 'short' });
  const formattedDate = date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return { date: formattedDate, day: dayName };
};

const HistoryLog: React.FC<HistoryLogProps> = ({
  logs,
  saveHistory,
  onToggleSaveHistory,
  onClearHistory,
  accentColor = 'teal',
}) => {
  const { t, isRTL, language } = useLanguage();
  const switchLabelId = useId();

  const isTeal = accentColor === 'teal';

  const badgeBg = isTeal
    ? 'bg-teal-100 text-teal-700'
    : 'bg-amber-100 text-amber-700';
  const switchActiveBg = isTeal ? 'bg-teal-600' : 'bg-amber-600';
  const iconColor = isTeal ? 'text-teal-600' : 'text-amber-600';

  const handleClear = () => {
    if (confirm(t.history.confirmClear)) {
      onClearHistory();
    }
  };

  const getActionLabel = (entry: HistoryLogEntry): string => {
    const absDelta = Math.abs(entry.delta);
    const dayUnit = absDelta === 1 ? t.common.day : t.common.days;

    switch (entry.action) {
      case 'day_increment':
        return `+${absDelta} ${dayUnit}`;
      case 'day_decrement':
        return `-${absDelta} ${dayUnit}`;
      case 'prayer_increment': {
        const prayerName = entry.prayer
          ? t.history.prayers[entry.prayer]
          : '';
        return `+${absDelta} ${prayerName}`;
      }
      case 'prayer_decrement': {
        const prayerName = entry.prayer
          ? t.history.prayers[entry.prayer]
          : '';
        return `-${absDelta} ${prayerName}`;
      }
      case 'auto_convert_day':
        return t.history.autoConvertedDay;
    }
  };

  const getResultSummary = (entry: HistoryLogEntry): string => {
    if (
      (entry.action === 'prayer_increment' ||
        entry.action === 'prayer_decrement') &&
      entry.prayerCountAfter !== undefined
    ) {
      return `${t.history.prayerCount} ${entry.prayerCountAfter}`;
    }
    return `${t.history.completedCount} ${entry.completedAfter} ${
      entry.completedAfter === 1 ? t.common.day : t.common.days
    }`;
  };

  return (
    <div className='mt-4 pt-4 border-t border-gray-200'>
      <details className='history-disclosure group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden'>
        <summary
          className={`flex items-center justify-between gap-2 px-3.5 py-3 cursor-pointer select-none hover:bg-gray-100 transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <ChevronDown
              size={16}
              aria-hidden='true'
              className='text-gray-500 transition-transform duration-200 group-open:rotate-180 flex-shrink-0'
            />
            <History
              size={18}
              aria-hidden='true'
              className={`${iconColor} flex-shrink-0`}
            />
            <span className='text-sm font-semibold text-gray-800'>
              {t.history.title}
            </span>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeBg}`}
          >
            {logs.length}
          </span>
        </summary>

        <div className='px-3.5 pb-3.5 pt-2 border-t border-gray-200 space-y-3'>
          <div
            className={`flex items-center justify-between gap-2 flex-wrap ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex items-center gap-2.5 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <button
                type='button'
                role='switch'
                aria-checked={saveHistory}
                aria-labelledby={switchLabelId}
                onClick={() => onToggleSaveHistory(!saveHistory)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  saveHistory ? switchActiveBg : 'bg-gray-300'
                }`}
              >
                <span
                  aria-hidden='true'
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    saveHistory
                      ? isRTL
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
              <span
                id={switchLabelId}
                onClick={() => onToggleSaveHistory(!saveHistory)}
                className='text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none'
              >
                {t.history.saveHistory}
              </span>
            </div>

            {logs.length > 0 && (
              <button
                type='button'
                onClick={handleClear}
                className={`flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <Trash2 size={14} aria-hidden='true' />
                <span>{t.history.clearHistory}</span>
              </button>
            )}
          </div>

          {!saveHistory && (
            <p
              className={`text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              {t.history.loggingDisabled}
            </p>
          )}

          {logs.length === 0 ? (
            <p className='text-xs sm:text-sm text-gray-500 text-center py-4'>
              {t.history.noLogs}
            </p>
          ) : (
            <ul className='space-y-2 max-h-60 overflow-y-auto pr-1'>
              {logs.map((entry) => {
                const { date, day } = formatLogTimestamp(
                  entry.timestamp,
                  language
                );
                const isDecrease =
                  entry.action === 'day_decrement' ||
                  entry.action === 'prayer_decrement';
                const isAutoConvert = entry.action === 'auto_convert_day';

                return (
                  <li
                    key={entry.id}
                    className={`flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-2xs ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2.5 min-w-0 ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isAutoConvert
                            ? 'bg-purple-100 text-purple-600'
                            : isDecrease
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {isAutoConvert ? (
                          <Sparkles size={14} aria-hidden='true' />
                        ) : isDecrease ? (
                          <ArrowDownRight size={14} aria-hidden='true' />
                        ) : (
                          <ArrowUpRight size={14} aria-hidden='true' />
                        )}
                      </div>
                      <div
                        className={`min-w-0 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isAutoConvert
                              ? 'text-purple-700'
                              : isDecrease
                              ? 'text-red-700'
                              : 'text-green-700'
                          }`}
                        >
                          {getActionLabel(entry)}
                        </p>
                        <p className='text-[11px] text-gray-500 truncate'>
                          {getResultSummary(entry)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex-shrink-0 ${
                        isRTL ? 'text-left' : 'text-right'
                      }`}
                    >
                      <p className='text-[11px] font-semibold text-gray-700'>
                        {day}
                      </p>
                      <p className='text-[10px] text-gray-500'>{date}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </details>
    </div>
  );
};

export default HistoryLog;
