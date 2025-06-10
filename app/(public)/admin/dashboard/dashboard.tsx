'use client';

import { useEffect, useState } from 'react';
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

// Define proper types for all data structures
interface BusRevenueMonthData {
  month: string;
  totalRevenue: number;
  totalBookings: number;
  nanduBusTotalRevenue: number;
  costPerKm: number;
  busRating: number;
  bookingStatusCounts: any; // Add this missing property
}

interface BusRevenueData {
  vehicleNumber: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  busRevenueResponse: BusRevenueMonthData[];
}

interface MonthlyRevenue {
  month: string;
  totalRevenue: number;
  totalBookings: number;
  nanduBusTotalRevenue: number;
  costPerKm: number;
  busRating: number;
}

interface Vehicle {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  vendorNumber: string;
  amtPerKM: number;
  mileage: number;
  seatCapacity: number;
  haltLocationAddress: string;
  vehicleStatus: string;
  filter: string;
  amenitiesResponses: Amenity[];
  vehicleImageDataResponses: VehicleImage[];
  vehicleImageUrl?: string;
}

interface Amenity {
  amenityId: string;
  amenityName: string;
  amenitiesImageUrl: string;
}

interface VehicleImage {
  vehicleImageId: string;
  vehicleImageUrl: string;
  vehicleImagePriority: number;
}

interface BusDetails {
  id: string;
  name: string;
  imageUrl?: string;
  totalRevenue: number;
  totalBookings: number;
  rating: number;
  nandubusRevenue: number;
  costPerKm: number;
  monthlyRevenue: BusRevenueMonthData[];
}

import { Bus, IndianRupee, Calendar, Star, RefreshCw, Search, ChevronDown, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { BusDetailsCard } from '@/components/dashboard/BusDetailsCard';
import { BusAnalysis } from '@/components/dashboard/BusAnalysis';
import { useRevenue } from '@/app/context/dashboardContext';
import { fetchAdminFilters, getAllVehicles } from '@/app/services/data.service';
import { API_CONSTANTS } from '@/app/services/api.route';
import { FilterPayload } from '@/app/types/fetchFilter.type';

export default function Dashboard() {
  const [selectedBus, setSelectedBus] = useState<BusDetails | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredBuses, setFilteredBuses] = useState<BusRevenueData[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<BusDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedVehicleData, setSelectedVehicleData] = useState<BusRevenueData | null>(null);
  const [filters, setFilters] = useState<FilterPayload>({ 
  statusFilters: [], 
 yearFilters: [] 
});

  
  const { 
    currentMonthData, 
    revenueData, 
    loading, 
    refreshRevenueData,
    topRatedBuses,
    fetchTopRatedBuses,
    fetchBusRevenue,
    busRevenue,
    setSelectedYear,
    setSelectedStatus,
    selectedYear,
    selectedStatus,
  } = useRevenue();
const fetchFilters = async () => {
  try {
    const response = await fetchAdminFilters();
    setFilters({
      statusFilters: response.statusFilters || [],
      yearFilters: response.yearFilters || []
    });
    // Set default selections if available
 
  } catch (error) {
    console.error("Error fetching filters:", error);
    // Set empty arrays if request fails
    setFilters({ statusFilters: [], yearFilters: [] });
  }
};
  // Initialize data and set filtered buses
  useEffect(() => {
    const fetchData = async () => {
     
       await fetchFilters();
      await fetchTopRatedBuses();
      setLastUpdated(new Date());
    };
    fetchData();
  }, []);
useEffect(() => {
  if (selectedStatus && selectedYear) {
    const fetchRevenueData = async () => {
      await refreshRevenueData();
    };
    fetchRevenueData();
  }
}, [selectedStatus, selectedYear]);


  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await getAllVehicles();
        setAllVehicles(vehicles as Vehicle[]);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    let buses = [...(topRatedBuses || [])] as BusRevenueData[];
    
    if (busRevenue) {
      const exists = buses.some(b => b.vehicleNumber === busRevenue.vehicleNumber);
      if (!exists) {
        buses = [busRevenue, ...buses];
      }
    }
    
    if (selectedVehicle) {
      const vehicleExists = buses.some(bus => bus.vehicleNumber === selectedVehicle.id);
      
      if (!vehicleExists) {
        const newBus: BusRevenueData = {
          vehicleNumber: selectedVehicle.id,
          vehicleName: selectedVehicle.name,
          vehicleImageUrl: selectedVehicle.imageUrl,
          busRevenueResponse: selectedVehicle.monthlyRevenue.length > 0 
            ? selectedVehicle.monthlyRevenue 
            : [{
                month: new Date().toLocaleString('default', { month: 'short' }),
                totalRevenue: selectedVehicle.totalRevenue,
                totalBookings: selectedVehicle.totalBookings,
                busRating: selectedVehicle.rating,
                nanduBusTotalRevenue: selectedVehicle.nandubusRevenue,
                costPerKm: selectedVehicle.costPerKm,
                bookingStatusCounts: {}
              }]
        };
        
        buses = [newBus, ...buses];
      }
    }
    
    if (selectedVehicleData) {
      const vehicleExists = buses.some(bus => bus.vehicleNumber === selectedVehicleData.vehicleNumber);
      
      if (!vehicleExists) {
        buses = [selectedVehicleData, ...buses];
      } else {
        // Update the existing bus with the latest data
        buses = buses.map(bus => 
          bus.vehicleNumber === selectedVehicleData.vehicleNumber ? selectedVehicleData : bus
        );
      }
    }
    
    // Apply search filtering
    if (searchTerm) {
      const filtered = buses.filter(bus => 
        bus.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBuses(filtered);
    } else {
      setFilteredBuses(buses);
    }
  }, [searchTerm, topRatedBuses, selectedVehicle, selectedVehicleData, busRevenue]);

  const monthlyRevenueData = revenueData?.monthlyRevenueTrend.map(month => ({
    month: month.month,
    revenue: month.revenue
  })) || [];
  // Add this useEffect to your Dashboard component

// This effect will update the selectedBus when selectedVehicleData changes
// Fix the useEffect that updates selectedBus when bus revenue data is fetched
useEffect(() => {
  if (selectedVehicleData && selectedBus) {
    // Make sure the IDs match
    if (selectedVehicleData.vehicleNumber === selectedBus.id) {
      // Get the first month data if available
      const monthData = selectedVehicleData.busRevenueResponse?.[0] || {
        totalRevenue: 0,
        totalBookings: 0,
        busRating: 0,
        nanduBusTotalRevenue: 0,
        costPerKm: 0
      };
      
      // Update the selectedBus with the actual data
      const updatedBusData: BusDetails = {
        id: selectedBus.id,
        name: selectedBus.name,
        imageUrl: selectedBus.imageUrl || selectedVehicleData.vehicleImageUrl,
        totalRevenue: monthData.totalRevenue,
        totalBookings: monthData.totalBookings,
        rating: monthData.busRating,
        nandubusRevenue: monthData.nanduBusTotalRevenue,
        costPerKm: monthData.costPerKm,
        monthlyRevenue: selectedVehicleData.busRevenueResponse || []
      };
      
      // Update the selectedBus with the complete data
      setSelectedBus(updatedBusData);
    }
  }
}, []);

  const topBookedBuses = (topRatedBuses || [])
    .map(bus => {
      const monthlyData = bus?.busRevenueResponse?.[0] || {};
      return {
        name: bus?.vehicleName || 'Unknown',
        totalTimesBooked: monthlyData?.totalBookings || 0,
        imageUrl: bus?.vehicleImageUrl || '',
        rating: monthlyData?.busRating || 0
      };
    })
    .sort((a, b) => b.totalTimesBooked - a.totalTimesBooked)
    .slice(0, 5);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshRevenueData(), fetchTopRatedBuses()]);
      setLastUpdated(new Date());
      setSelectedVehicle(null); // Reset selected vehicle on refresh
      setSelectedVehicleData(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewAnalysis = async (bus: BusDetails) => {
    try {
      // Fetch data using context's fetchBusRevenue
      const busData = await fetchBusRevenue(bus.id);
      
      if (busData) {
        const monthData = busData.busRevenueResponse?.[0] || {
          totalRevenue: 0,
          totalBookings: 0,
          busRating: 0,
          nanduBusTotalRevenue: 0,
          costPerKm: bus.costPerKm || 0
        };
        
        const completeBus: BusDetails = {
          id: busData.vehicleNumber,
          name: busData.vehicleName,
          imageUrl: busData.vehicleImageUrl || bus.imageUrl,
          totalRevenue: monthData.totalRevenue,
          totalBookings: monthData.totalBookings,
          rating: monthData.busRating,
          nandubusRevenue: monthData.nanduBusTotalRevenue,
          costPerKm: monthData.costPerKm,
          monthlyRevenue: busData.busRevenueResponse || []
        };
        
        setSelectedBus(completeBus);
        setSelectedVehicleData(busData);
      }
    } catch (error) {
      console.error("Error fetching bus revenue data for analysis:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Nandubus Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors ${
                isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Last updated:</span>
              <span className="font-medium">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
{/* Modify your header section to include the dropdowns */}
   <div className="flex items-center gap-4 mb-8">
        {/* Year dropdown */}
        {filters.yearFilters.length > 0 && (
          <div className="relative">
            <div className="relative">
              <select
                value={selectedYear.toString()}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none w-36 pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filters.yearFilters.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        )}
        
        {/* Status dropdown */}
        {filters.statusFilters.length > 0 && (
          <div className="relative">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none w-36 pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filters.statusFilters.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        )}
      </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <DashboardCard
            title="Total Revenue"
            value={`₹${revenueData?.totalRevenue?.toLocaleString('en-IN') || '0'}`}
            trend={revenueData?.revenueGrowthPercentage || 0}
            icon={
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#a855f7]/20">
                <IndianRupee className="w-6 h-6 text-[#a855f7] flex-shrink-0" />
              </div>
            }
          />
          <DashboardCard
            title="Total Bookings"
            value={revenueData?.totalBookings?.toString() || '0'}
            trend={revenueData?.bookingGrowthPercentage || 0}
            icon={
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#a855f7]/20">
                <Calendar className="w-6 h-6 text-[#a855f7] flex-shrink-0" />
              </div>
            }
          />
          <DashboardCard
            title="Nandhubus Revenue"
            value={`₹${revenueData?.nandhubusRevenue?.toLocaleString('en-IN') || '0'}`}
            trend={revenueData?.nanduBusRevenuePercentage || 0}
            icon={
              <div className="w-10 h-10 flex items-center justify-center rounded-full">
                <img
                  src="/assests/Logo.png"
                  alt="Nandhubus Logo"
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              </div>
            }
          />
          <DashboardCard
  title="vendor Revenue"
value={`₹${Number(revenueData?.vendorRevenue || 0).toLocaleString('en-IN')}`}
  icon={
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b82f6]/20">
      <DollarSign className="w-6 h-6 text-[#3b82f6] flex-shrink-0" />
    </div>
  }
/>
<DashboardCard
            title="Average Rating"
            value={revenueData?.averageRating?.toFixed(1) || '0.0'}
        
            icon={
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b82f6]/20">
                <Star className="w-6 h-6 text-[#3b82f6] flex
                -shrink-0" />
              </div>
            }
          />

          
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Monthly Revenue Trend</h2>
            <div className="h-[250px] sm:h-[300px] w-full">
              {monthlyRevenueData.length > 0 ? (
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
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No revenue data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Top Booked Buses</h2>
            <div className="h-[250px] sm:h-[300px] w-full">
              {topBookedBuses.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBookedBuses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      height={80}
                      interval={0}
                      tick={({ payload, x, y }) => {
                        const words = payload.value.split(' ');
                        return (
                          <g transform={`translate(${x},${y})`}>
                            {words.map((word:string, index:number) => (
                              <text
                                key={index}
                                x={0}
                                y={index * 14} // space between lines
                                dy={16}
                                textAnchor="middle"
                                fill="#666"
                                fontSize={12}
                              >
                                {word}
                              </text>
                            ))}
                          </g>
                        );
                      }}
                    />

                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3 mb-2">
                                <img 
                                  src={data.imageUrl} 
                                  alt={data.name} 
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-semibold">{data.name}</p>
                                  <p className="text-sm">Rating: {data.rating.toFixed(1)}</p>
                                </div>
                              </div>
                              <p className="font-medium">Bookings: {data.totalTimesBooked}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar 
                      dataKey="totalTimesBooked" 
                      name="Total Bookings" 
                      fill="#4f46e5" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No booking data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Performance Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Vehicle Performance</h2>
          <div className="relative w-full sm:w-80">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by vehicle number or name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all shadow-sm hover:border-gray-300 text-sm font-medium text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {showDropdown && allVehicles.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-72 overflow-auto border border-gray-200">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Available Vehicles ({allVehicles.filter(v => v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) || v.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())).length})
                </div>
                {allVehicles
                  .filter(vehicle => 
                    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(vehicle => (
                    <div
                      key={vehicle.vehicleNumber}
                      className="px-3 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors duration-150 flex items-center"
                     // In your dashboard component, modify the search dropdown handler:

// Replace this part in your onMouseDown handler for search results
// Modified search dropdown handler for vehicle selection
onMouseDown={async (e) => {
  e.preventDefault();
  setShowDropdown(false);
 
  
  try {
    // Create temporary bus object
    const tempBus: BusDetails = {
      id: vehicle.vehicleNumber,
      name: vehicle.vehicleName,
      imageUrl: vehicle.vehicleImageDataResponses?.[0]?.vehicleImageUrl,
      totalRevenue: 0,
      totalBookings: 0,
      rating: 0,
      nandubusRevenue: 0,
      costPerKm: vehicle.amtPerKM || 0,
      monthlyRevenue: []
    };
    
    // Set temporary data
    setSelectedBus(tempBus);
    setSelectedVehicle(tempBus);
    
    // Fetch complete data using context's fetchBusRevenue
    const busData = await fetchBusRevenue(vehicle.vehicleNumber);
    
    if (busData) {
      const monthData = busData.busRevenueResponse?.[0] || {
        totalRevenue: 0,
        totalBookings: 0,
        busRating: 0,
        nanduBusTotalRevenue: 0,
        costPerKm: vehicle.amtPerKM || 0
      };
      
      const completeBus: BusDetails = {
        id: busData.vehicleNumber,
        name: busData.vehicleName,
        imageUrl: busData.vehicleImageUrl || tempBus.imageUrl,
        totalRevenue: monthData.totalRevenue,
        totalBookings: monthData.totalBookings,
        rating: monthData.busRating,
        nandubusRevenue: monthData.nanduBusTotalRevenue,
        costPerKm: monthData.costPerKm,
        monthlyRevenue: busData.busRevenueResponse || []
      };
      
      // Update state with complete data
      setSelectedBus(completeBus);
      setSelectedVehicle(completeBus);
      setSelectedVehicleData(busData);
    }
  } catch (error) {
    console.error("Error fetching bus data:", error);
  }
}}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gray-100 overflow-hidden">
                        {vehicle.vehicleImageDataResponses?.[0]?.vehicleImageUrl ? (
                          <img 
                            src={vehicle.vehicleImageDataResponses[0].vehicleImageUrl} 
                            alt={vehicle.vehicleName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Bus className="h-4 w-4 m-2 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</div>
                        <div className="text-xs text-gray-500 truncate">{vehicle.vehicleName}</div>
                      </div>
                    </div>
                  ))}
                {allVehicles.filter(v =>
                  v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  v.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    No vehicles found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBuses.map((bus) => {
            // Explicitly check if busRevenueResponse exists and has values
            const busRevenueResponse = bus.busRevenueResponse || [];
            const firstMonthData = busRevenueResponse[0] || {
              totalRevenue: 0,
              totalBookings: 0,
              busRating: 0,
              nanduBusTotalRevenue: 0,
              costPerKm: 0
            };
            
            return (
              <BusDetailsCard 
                key={bus.vehicleNumber}
                bus={{
                  id: bus.vehicleNumber,
                  name: bus.vehicleName,
                  imageUrl: bus.vehicleImageUrl as string,
                  totalRevenue: firstMonthData.totalRevenue,
                  totalBookings: firstMonthData.totalBookings,
                  rating: firstMonthData.busRating,
                  nandubusRevenue: firstMonthData.nanduBusTotalRevenue,
                  costPerKm: firstMonthData.costPerKm,
                  monthlyRevenue: busRevenueResponse
                }}
                onViewAnalysis={handleViewAnalysis}
                fetchBusRevenue={fetchBusRevenue}
              />
            );
          })}
          {filteredBuses.length === 0 && (
            <div className="col-span-3 py-12 text-center text-gray-500">
              No vehicles found matching your criteria
            </div>
          )}
        </div>
      </div>

      {selectedBus && (
        <BusAnalysis 
          bus={selectedBus} 
          onClose={() => setSelectedBus(null)} 
        />
      )}
    </div>
  );
}