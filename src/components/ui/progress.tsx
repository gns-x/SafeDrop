import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inside';
  className?: string;
  animated?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelPosition = 'top',
  className,
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const progressBar = (
    <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size], className)}>
      <motion.div
        className={cn('h-full rounded-full transition-all duration-1000 ease-out', variants[variant])}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
      />
    </div>
  );

  const label = showLabel && (
    <div className={cn('font-medium text-gray-700', labelSizes[size])}>
      {percentage.toFixed(1)}%
    </div>
  );

  if (labelPosition === 'inside') {
    return (
      <div className="relative">
        {progressBar}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-white drop-shadow-sm', labelSizes[size])}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {labelPosition === 'top' && label}
      {progressBar}
      {labelPosition === 'bottom' && label}
    </div>
  );
};

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = false,
  className,
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variants = {
    default: 'stroke-blue-500',
    success: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    error: 'stroke-red-500',
    gradient: 'stroke-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={cn('transition-all duration-1000 ease-out', variants[variant])}
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">
            {percentage.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

export { Progress, CircularProgress };
