"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetVendorVehiclesById } from "@/app/services/admin.service";
import { 
  FaBus, 
  FaTag, 
  FaGasPump, 
  FaShieldAlt, 
  FaTimesCircle, 
  FaInfoCircle,
  FaRupeeSign
} from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { IoMdSpeedometer } from "react-icons/io";
import { MdAcUnit, MdAirlineSeatReclineNormal } from "react-icons/md";
import { FaBed } from "react-icons/fa";

// Define TypeScript interfaces for our data
interface PolicyData {
  id: string | number;
  policyMessage: string;
}

interface Policy {
  policyId: string | number;
  policyDescription: string;
  policyData: PolicyData[];
}

interface VehicleImage {
  vehicleImageId: string;
  vehicleImageUrl: string;
  vehicleImagePriority: number;
}

interface VehicleData {
  vehicleName: string;
  vehicleNumber: string;
  vehicleAC: string;
  sleeper: string;
  seatCapacity: number;
  mileage: number;
  amtPerKM: number;
  isFastTagAvailable: boolean;
  s3ImageUrl?: VehicleImage[];
  amenities?: string[];
  policies?: Policy[];
}

const fetchVendorVehicles = async (vendorId: string) => {
  const response = await GetVendorVehiclesById(vendorId);
  return response as VehicleData[];
};

function Page() {
  const { vendorId } = useParams<{ vendorId: string }>();

  const { data, isLoading, isError, error }: UseQueryResult<VehicleData[], Error> =
    useQuery({
      queryKey: ["vendorVehicleData", vendorId],
      queryFn: () => fetchVendorVehicles(vendorId),
    });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <GiSteeringWheel className="text-5xl text-blue-600 mb-4 animate-spin" />
        <p className="text-lg text-gray-600">Loading vehicle details...</p>
      </div>
    </div>
  );

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <div className="flex items-center">
            <FaTimesCircle className="mr-2" />
            <strong>Error: </strong> {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded max-w-md">
          <div className="flex items-center">
            <FaInfoCircle className="mr-2" />
            No vendor vehicle data available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaBus className="mr-3 text-blue-600" />
          Vendor Vehicle Details
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((vehicle, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Vehicle Image */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-40 flex items-center justify-center relative">
                {vehicle.s3ImageUrl && vehicle.s3ImageUrl.length > 0 ? (
                  <img 
                    src={vehicle.s3ImageUrl[0].vehicleImageUrl} 
                    alt={vehicle.vehicleName} 
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      
                      const parent = target.parentElement;
                      const fallbackIcon = parent?.querySelector('.fallback-icon') as HTMLDivElement | null;
                      if (fallbackIcon) {
                        fallbackIcon.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <div className={`fallback-icon ${vehicle.s3ImageUrl && vehicle.s3ImageUrl.length > 0 ? 'hidden' : 'block'} absolute inset-0 flex items-center justify-center`}>
                  <GiSteeringWheel className="text-white text-6xl opacity-30" />
                </div>
              </div>
              
              <div className="p-5">
                {/* Header with vehicle name and number */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 truncate max-w-[70%]">{vehicle.vehicleName}</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {vehicle.vehicleNumber}
                  </span>
                </div>
                
                {/* Vehicle Specifications in a consistent grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      {vehicle.vehicleAC === 'NA' ? (
                        <MdAcUnit className="text-gray-400 text-sm" />
                      ) : (
                        <MdAcUnit className="text-blue-600 text-sm" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">AC</p>
                      <p className="text-sm font-medium">{vehicle.vehicleAC === 'NA' ? 'Non-AC' : 'AC'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      {vehicle.sleeper === 'NS' ? (
                        <MdAirlineSeatReclineNormal className="text-blue-600 text-sm" />
                      ) : (
                        <FaBed className="text-blue-600 text-sm" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium">{vehicle.sleeper === 'NS' ? 'Seater' : 'Sleeper'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <IoMdSpeedometer className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seats</p>
                      <p className="text-sm font-medium">{vehicle.seatCapacity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <FaGasPump className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="text-sm font-medium">{vehicle.mileage} kmpl</p>
                    </div>
                  </div>
                </div>
                
                {/* Pricing - Adjusted size and layout */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                        <FaRupeeSign className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Rate per km</p>
                        <p className="text-base font-bold text-blue-700">₹{vehicle.amtPerKM}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                        <FaTag className={vehicle.isFastTagAvailable ? "text-green-600 text-sm" : "text-gray-400 text-sm"} />
                      </div>
                      <span className={`text-xs font-medium ${vehicle.isFastTagAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                        {vehicle.isFastTagAvailable ? 'FastTag Available' : 'No FastTag'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Amenities - More compact design */}
                {vehicle.amenities && vehicle.amenities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.amenities.map((amenity: string, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Policies - More compact */}
                {vehicle.policies && vehicle.policies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <FaShieldAlt className="mr-1.5 text-blue-600 text-xs" />
                      Policies
                    </h3>
                    <div className="space-y-3">
                      {vehicle.policies.map((policy: Policy) => (
                        <div key={policy.policyId} className="border-l-3 border-blue-500 pl-3">
                          <h4 className="text-xs font-medium text-gray-700 mb-1">{policy.policyDescription}</h4>
                          <ul className="space-y-0.5 text-xs text-gray-600">
                            {policy.policyData.map((item: PolicyData) => (
                              <li key={item.id} className="flex items-start">
                                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-1.5"></span>
                                {item.policyMessage}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;