import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn, formatCurrency, formatNumber, formatPercentage } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger';
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  onClick,
  loading = false
}) => {
  const variants = {
    default: {
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      border: 'border-gray-200',
      text: 'text-gray-900'
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
      text: 'text-emerald-900'
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      border: 'border-amber-200',
      text: 'text-amber-900'
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
      text: 'text-blue-900'
    },
    danger: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-red-200',
      text: 'text-red-900'
    }
  };

  const currentVariant = variants[variant];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg',
          currentVariant.bg,
          currentVariant.border,
          className
        )}
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className={cn('h-12 w-12 rounded-xl', currentVariant.iconBg)} />
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-8 w-32 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl cursor-pointer group',
        currentVariant.bg,
        currentVariant.border,
        className
      )}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={cn('p-3 rounded-xl transition-all duration-300 group-hover:scale-110', currentVariant.iconBg)}
            whileHover={{ rotate: 5 }}
          >
            <Icon className={cn('w-6 h-6', currentVariant.iconColor)} />
          </motion.div>
          
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1"
            >
              <div className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
                trend.isPositive 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              )}>
                <span className={trend.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                <span>{trend.value}</span>
                {trend.label && <span className="ml-1">{trend.label}</span>}
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <motion.p
            className={cn('text-3xl font-bold', currentVariant.text)}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {typeof value === 'number' && title.toLowerCase().includes('revenue') 
              ? formatCurrency(value)
              : typeof value === 'number' 
                ? formatNumber(value)
                : value
            }
          </motion.p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export { StatCard };
