'use client';

import React from 'react';
import Image from 'next/image';
import { Bus, Star, Eye, IndianRupee, Calendar, TrendingUp, TrendingDown, DollarSign, MapPin, X } from 'lucide-react';

interface BookingStatusCounts {
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
}

interface BusRevenueMonthData {
  month: string;
  totalRevenue: number;
  totalBookings: number;
  nanduBusTotalRevenue: number;
  costPerKm: number;
  busRating: number;
  bookingStatusCounts: BookingStatusCounts;
}

interface BusRevenueData {
  vehicleNumber: string;
  vehicleName: string;
  vehicleImageUrl: string;
  busRevenueResponse: BusRevenueMonthData[];
}

interface BusDetailsCardProps {
  bus: {
    id: string;
    name: string;
    imageUrl: string;
    totalRevenue: number;
    totalBookings: number;
    rating: number;
    nandubusRevenue?: number;
    costPerKm?: number;
    monthlyRevenue?: any[];
    cancelledCount?: number;
  };
  onViewAnalysis: (bus: any) => void;
  fetchBusRevenue: (vehicleNumber: string) => Promise<BusRevenueData|null>;
}

export const BusDetailsCard: React.FC<BusDetailsCardProps> = ({ 
  bus, 
  onViewAnalysis, 
  fetchBusRevenue 
}) => {
  const handleViewAnalysis = async () => {
    await fetchBusRevenue(bus.id);
    onViewAnalysis(bus);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 w-full">
      {/* Image with Overlay */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <Image 
          src={bus.imageUrl || '/default-bus-image.jpg'} 
          alt={bus.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white truncate">{bus.name}</h3>
            <div className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              <span className="text-sm font-medium">{bus.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Revenue */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-lg bg-purple-100 text-purple-600">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-base font-semibold">₹{bus.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Bookings</p>
              <p className="text-base font-semibold">{bus.totalBookings}</p>
            </div>
          </div>

          {/* Nandubus Revenue */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-lg bg-green-100 text-green-600">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nandhubus Revenue</p>
              <p className="text-base font-semibold">
                ₹{(bus.nandubusRevenue || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Cost per KM */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5 p-1.5 rounded-lg bg-amber-100 text-amber-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cost per KM</p>
              <p className="text-base font-semibold">
                {bus.costPerKm ? `₹${bus.costPerKm}` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Cancelled Bookings - Added as a third row */}
          <div className="flex items-start gap-2 col-span-2">
            <div className="mt-0.5 p-1.5 rounded-lg bg-red-100 text-red-600">
              <X className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cancelled Bookings</p>
              <p className="text-base font-semibold">
                {bus.cancelledCount || 0}
              </p>
            </div>
          </div>
        </div>
        
        {/* View Analysis Button */}
        <button
          onClick={handleViewAnalysis}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View Analysis
        </button>
      </div>
    </div>
  );
};