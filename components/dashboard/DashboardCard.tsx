'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus, MoveHorizontal } from 'lucide-react';
import { MdTrendingFlat } from 'react-icons/md';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number; // Can be positive or negative
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon = <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600" />,
  trend = 0,
}) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? 'text-emerald-600' : 'text-red-600';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between mb-3 sm:mb-4">
    <h3 className="text-gray-500 text-xs sm:text-sm font-medium">{title}</h3>
    {icon}
  </div>
  <div className="flex items-end justify-between">
    <div>
      <p className="text-xl sm:text-2xl font-semibold text-gray-800">
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
      <div className="mt-2">
        {trend > 0 && (
          <p className="text-xs sm:text-sm text-green-600 flex items-center gap-1">
            <ArrowUpRight className="w-3 sm:w-4 h-3 sm:h-4" />
            {trend}% increase
          </p>
        )}
        {trend < 0 && (
          <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
            <ArrowDownRight className="w-3 sm:w-4 h-3 sm:h-4" />
            {Math.abs(trend)}% decrease
          </p>
        )}
        {trend === 0 && (
           <p className="text-xs sm:text-sm text-orange-600 flex items-center gap-1">
    0% 
        <MdTrendingFlat  className="w-3 sm:w-4 h-3 sm:h-4" />

  </p>
        )}
      </div>
    </div>
  </div>
</div>
  );
};