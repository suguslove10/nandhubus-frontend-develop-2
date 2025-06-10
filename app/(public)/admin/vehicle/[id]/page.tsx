"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useVehicle } from "@/app/hooks/vehicle/useVehicle";
import VehicleUpdateForm from "@/components/vehicle/UpdateVehicle";
import { Trash, ArrowLeft, MapPin, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/app/services/admin.service";

export default function VehicleDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: vehicle, isLoading, error } = useVehicle(id);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [showvehicleDeleteDialog, setShowvehicleDeleteDialog] = useState(false);
  
  const handleDeleteVehicle = async () => {
    try {
      await deleteVehicle(id); 
      setShowvehicleDeleteDialog(false); 
      window.location.href = '/admin/vehicle/view'; 
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading vehicle details
          </h3>
          <p className="text-gray-600 mb-4">
            The vehicle you're looking for might not exist or there was an error.
          </p>
          <Link href="/admin/vehicle/view">
            <Button className="w-full sm:w-auto">
              Back to Vehicles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedImages = [...vehicle.vehicleImageDataResponses].sort(
    (a, b) => a.vehicleImagePriority - b.vehicleImagePriority
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center">
      <Button asChild variant="ghost" className="pl-0 flex items-center text-blue-600 hover:text-blue-800">
  <Link href="/admin/vehicle/view">
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back to all vehicles
  </Link>
</Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Header Section with Name and Status */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {vehicle.vehicleName}
                <span className="ml-3 text-sm font-medium text-gray-500">{vehicle.vehicleNumber}</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  vehicle.filter.includes("AC")
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {vehicle.filter.includes("AC") ? "AC" : "Non-AC"}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  vehicle.vehicleStatus === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {vehicle.vehicleStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery - Left Column */}
          <div className="lg:w-1/2 p-4">
            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden shadow-md mb-4">
              <div className="aspect-[4/3] w-full">
                {sortedImages.length > 0 ? (
                  <Image
                    src={sortedImages[selectedImage].vehicleImageUrl}
                    alt={vehicle.vehicleName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {sortedImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {sortedImages.map((img, index) => (
                  <button
                    key={img.vehicleImageId}
                    className={`relative h-16 w-20 flex-shrink-0 rounded-md overflow-hidden shadow transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-blue-500 transform scale-105"
                        : "hover:ring-1 hover:ring-gray-300"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img.vehicleImageUrl}
                      alt={`${vehicle.vehicleName} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Location Section */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Halt Location</p>
                  <p className="text-gray-600">{vehicle.haltLocationAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section - Right Column */}
          <div className="lg:w-1/2 p-6 lg:border-l border-gray-200">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
                <p className="text-sm text-blue-700 mb-1">Price per KM</p>
                <p className="text-xl font-bold text-blue-900">₹{vehicle.amtPerKM}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
                <p className="text-sm text-green-700 mb-1">Mileage</p>
                <p className="text-xl font-bold text-green-900">{vehicle.mileage} km/l</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
                <p className="text-sm text-amber-700 mb-1">Seating Capacity</p>
                <p className="text-xl font-bold text-amber-900">{vehicle.seatCapacity} seats</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-100">
                <p className="text-sm text-purple-700 mb-1">Vendor</p>
                <p className="text-xl font-bold text-purple-900">{vehicle.vendorNumber}</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 shadow-sm border border-teal-100">
    <p className="text-sm text-teal-700 mb-1">Day Driver Bata</p>
    <p className="text-xl font-bold text-teal-900">₹{vehicle.dayDriverBata}</p>
  </div>
  <div className="bg-indigo-50 rounded-xl p-4 shadow-sm border border-indigo-100">
    <p className="text-sm text-indigo-700 mb-1">Night Driver Bata</p>
    <p className="text-xl font-bold text-indigo-900">₹{vehicle.nightDriverBata}</p>
  </div>
            </div>

            {/* Amenities Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {vehicle.amenitiesResponses.map((amenity) => (
                  <div
                    key={amenity.amenityId}
                    className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="p-1 bg-blue-50 rounded-md mr-2">
                      <Image
                        src={amenity.amenitiesImageUrl}
                        alt={amenity.amenityName}
                        width={16}
                        height={16}
                        className="w-5 h-5"
                      />
                    </div>
                    <span className="text-sm font-medium">{amenity.amenityName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-200">
              <VehicleUpdateForm vehicle={vehicle} />
              <button
                onClick={() => setShowvehicleDeleteDialog(true)}
                className="p-2 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Delete vehicle"
              >
                <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showvehicleDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowvehicleDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteVehicle}
                >
                  Delete Vehicle
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}