'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressCircle: React.FC<ProgressBarProps> = ({
  percentage,
  size = 140,
  strokeWidth = 10,
  color = '#0d9488',
  backgroundColor = '#e2e8f0',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className='relative' style={{ width: size, height: size }}>
      <svg width={size} height={size} className='transform -rotate-90'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill='none'
          className='opacity-50'
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          className='transition-all duration-700 ease-out'
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className='text-3xl font-bold text-gray-800'>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

interface LinearProgressBarProps {
  percentage: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
}

export const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  percentage,
  height = 8,
  color = '#0d9488',
  backgroundColor = '#e2e8f0',
  showLabel = false,
}) => {
  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between mb-1'>
          <span className='text-sm font-medium text-gray-600'>Progress</span>
          <span className='text-sm font-medium text-gray-700'>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className='w-full rounded-full overflow-hidden'
        style={{ backgroundColor, height }}
      >
        <div
          className='h-full rounded-full transition-all duration-700 ease-out'
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressCircle;
