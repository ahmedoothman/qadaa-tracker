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
  size = 120,
  strokeWidth = 8,
  color = '#2D5F5D',
  backgroundColor = '#E5E7EB',
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
          className='transition-all duration-500'
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className='text-2xl font-bold text-gray-800'>
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
  color = '#2D5F5D',
  backgroundColor = '#E5E7EB',
  showLabel = false,
}) => {
  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between mb-1'>
          <span className='text-sm font-medium text-gray-700'>Progress</span>
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
          className='h-full rounded-full transition-all duration-500'
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ProgressCircle;
