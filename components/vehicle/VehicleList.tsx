import { useState } from "react";
import { VehicleCard } from "./VehicleCard";
import { Vehicle } from "@/app/types/vehicleType";
import { useVehicles } from "@/app/hooks/vehicle/useVehicle";

export const VehicleList = () => {
  const { data: vehicles, isLoading, error } = useVehicles();
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F7BAB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-2">Error loading vehicles</h3>
        <p className="text-sm">Please try again later or contact support.</p>
      </div>
    );
  }

  const filterVehicles = (vehicles: Vehicle[] | undefined): Vehicle[] => {
    if (!vehicles) return [];

    return vehicles.filter((vehicle) => {
      // Filter by type (AC/NA)
      if (filterType !== "ALL" && !vehicle.filter.includes(filterType)) {
        return false;
      }

      // Search term filtering
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          vehicle.vehicleName.toLowerCase().includes(term) ||
          vehicle.vehicleNumber.toLowerCase().includes(term) ||
          vehicle.haltLocationAddress.toLowerCase().includes(term)
        );
      }

      return true;
    });
  };

  const filteredVehicles = filterVehicles(vehicles);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Available Vehicles
        </h1>
        <p className="text-gray-600 mb-6">Browse and select your preferred vehicle</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, number or location..."
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg shadow-sm
                 focus:ring-2 focus:ring-[#0F7BAB] focus:border-[#0F7BAB] transition-all
                 hover:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "ALL"
                  ? "bg-[#0F7BAB] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilterType("ALL")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "AC"
                  ? "bg-[#0F7BAB] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilterType("AC")}
            >
              AC
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "NA"
                  ? "bg-[#0F7BAB] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilterType("NA")}
            >
              Non-AC
            </button>
          </div>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            No vehicles found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};