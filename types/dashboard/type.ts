export interface BusData {
    id: number;
    name: string;
    totalRevenue: number;
    totalBookings: number;
    nandubusRevenue: number;
    totalTimesBooked: number;
    costPerKm: number;
    monthlyRevenue: {
      month: string;
      revenue: number;
    }[];
    rating: number;
    image: string;
  }
  
  export interface MonthlyData {
    month: string;
    revenue: number;
  }