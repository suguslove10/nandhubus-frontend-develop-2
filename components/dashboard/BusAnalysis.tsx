'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { X } from 'lucide-react';

interface BusAnalysisProps {
  bus: {
    id: string;
    name: string;
    monthlyRevenue: Array<{
      month: string;
      totalRevenue: number;
      totalBookings: number;
      nanduBusTotalRevenue: number;
      costPerKm: number;
      busRating: number;
    }>;
    totalRevenue: number;
    totalBookings: number;
    rating: number;
    nandubusRevenue?: number;
    costPerKm?: number;
  };
  onClose: () => void;
}

export const BusAnalysis: React.FC<BusAnalysisProps> = ({ bus, onClose }) => {
  // Transform monthly revenue data for the chart
  const monthlyRevenueData = useMemo(() => {
    return bus.monthlyRevenue?.map(month => ({
      month: month.month,
      revenue: month.totalRevenue,
      bookings: month.totalBookings,
      nandubusRevenue: month.nanduBusTotalRevenue
    })) || [];
  }, [bus.monthlyRevenue]);

  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold line-clamp-1">{bus.name} - Performance Analysis</h2>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6">
            {/* Monthly Revenue Trend */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      name="Bookings"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Revenue Distribution */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Revenue Distribution</h3>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Total Revenue', value: bus.totalRevenue },
                      { name: 'Nandhubus Revenue', value: bus.nandubusRevenue || 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="value" name="Amount (₹)" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Bookings', value: bus.totalBookings },
                      { name: 'Cost/KM', value: bus.costPerKm || 0 },
                      { name: 'Rating', value: bus.rating }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        // label={{ value: 'Rating (out of 5)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="value" name="Metrics" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};