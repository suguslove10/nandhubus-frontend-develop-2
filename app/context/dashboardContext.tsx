'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllRevenue, getBusRevenue, getTopRated } from '../services/data.service';
interface BookingStatusCounts {
  enquiryCount: number;
  bookedCount: number;
  rescheduledCount: number;
  completedCount: number;
  cancelledCount: number;
  inProgressCount: number;
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
  vehicleName:string;
  vehicleImageUrl: string;
  busRevenueResponse: BusRevenueMonthData[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RevenueData {
  totalRevenue: number;
  revenueGrowthPercentage: number;
  totalBookings: number;
  bookingGrowthPercentage: number;
  nandhubusRevenue: number;
  nanduBusRevenuePercentage:number;
  vendorRevenue:string;
  averageRating: number;
  monthlyRevenueTrend: MonthlyRevenue[];
}

interface RevenueContextType {
  // Dashboard revenue data
  revenueData: RevenueData|undefined;
  loading: boolean;
  error: string | null;
  refreshRevenueData: () => Promise<void>;
  currentMonthData?: MonthlyRevenue;
  
  // Bus-specific revenue data
  busRevenue: BusRevenueData | null;
  selectedYear: number;
  selectedStatus: string;
  setSelectedYear: (year: number) => void;
  setSelectedStatus: (status: string) => void;
  busLoading: boolean;
  busError: string | null;
  fetchBusRevenue: (vehicleNumber: string) => Promise<BusRevenueData|null>;
  currentBusMonthData?: BusRevenueMonthData;

  // Top-rated buses data
  topRatedBuses: BusRevenueData[];
  topRatedLoading: boolean;
  topRatedError: string | null;
  fetchTopRatedBuses: () => Promise<void>;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const RevenueProvider = ({ children }: { children: ReactNode }) => {
  // Dashboard revenue state
  const [revenueData, setRevenueData] = useState<RevenueData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bus revenue state
  const [busRevenue, setBusRevenue] = useState<BusRevenueData | null>(null);
  const [busLoading, setBusLoading] = useState(false);
  const [busError, setBusError] = useState<string | null>(null);

    // Top-rated buses state
    const [topRatedBuses, setTopRatedBuses] = useState<BusRevenueData[]>([]);
    const [topRatedLoading, setTopRatedLoading] = useState(false);
    const [topRatedError, setTopRatedError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
const [selectedStatus, setSelectedStatus] = useState<string>('Completed');

  // Fetch all revenue data
  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const data = await getAllRevenue(selectedStatus,selectedYear) as RevenueData;
      setRevenueData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bus-specific revenue data
// In your context, make sure fetchBusRevenue returns the data
const fetchBusRevenue = async (vehicleNumber:string) => {
  try {
    setBusLoading(true);
    setBusError(null);
    const data = await getBusRevenue(vehicleNumber) as BusRevenueData;
    setBusRevenue(data); // This should trigger the state update
    return data; // Return the data for direct use
  } catch (err) {
    setBusError(`Failed to fetch revenue for vehicle ${vehicleNumber}`);
    return null;
  } finally {
    setBusLoading(false);
  }
};

  // Fetch top-rated buses
  const fetchTopRatedBuses = async () => {
    try {
      setTopRatedLoading(true);
      setTopRatedError(null);
      const data = await getTopRated() as BusRevenueData[];
      setTopRatedBuses(data);
    } catch (err) {
      setTopRatedError('Failed to fetch top-rated buses');
    } finally {
      setTopRatedLoading(false);
    }
  };
 const currentMonthData = (revenueData && revenueData.monthlyRevenueTrend && revenueData.monthlyRevenueTrend.length > 0)
  ? revenueData.monthlyRevenueTrend[0]
  : undefined;


  const currentBusMonthData = busRevenue?.busRevenueResponse?.[0];


  return (
    <RevenueContext.Provider 
      value={{ 
        // Dashboard revenue
        revenueData, 
        loading, 
        error, 
        refreshRevenueData: fetchRevenueData,
        currentMonthData,
        
        // Bus revenue
        busRevenue,
        busLoading,
        busError,
        fetchBusRevenue,
        currentBusMonthData,
        selectedYear,
        setSelectedStatus,
        selectedStatus,
        setSelectedYear,
          
        // Top-rated buses
        topRatedBuses,
        topRatedLoading,
        topRatedError,
        fetchTopRatedBuses
      }}
    >
      {children}
    </RevenueContext.Provider>
  );
};

export const useRevenue = () => {
  const context = useContext(RevenueContext);
  if (context === undefined) {
    throw new Error('useRevenue must be used within a RevenueProvider');
  }
  return context;
};