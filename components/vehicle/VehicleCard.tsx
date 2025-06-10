import { Vehicle } from "@/app/types/vehicleType";
import Image from "next/image";
import Link from "next/link";
import OptimizedImage from "../ui/OptimizedImage";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  // Get the main image (lowest priority number)
  const mainImage = vehicle.vehicleImageDataResponses.sort(
    (a, b) => a.vehicleImagePriority - b.vehicleImagePriority
  )[0];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 max-w-sm w-full">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        {mainImage ? (
          <OptimizedImage
            src={mainImage.vehicleImageUrl}
            alt={vehicle.vehicleName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
            quality={75}
            placeholder="blur"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title and Number */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {vehicle.vehicleName}
          </h3>
          <p className="text-sm text-gray-500">{vehicle.vehicleNumber}</p>
        </div>

        {/* Price and Capacity */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-base font-medium text-gray-900">₹{vehicle.amtPerKM}</span>
            <span className="text-sm text-gray-500">/km</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-sm text-gray-500">{vehicle.seatCapacity} seats</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-2 pt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-gray-600 line-clamp-2">{vehicle.haltLocationAddress}</p>
        </div>

        {/* Amenities */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          {vehicle.amenitiesResponses.slice(0, 4).map((amenity) => (
            <div
              key={amenity.amenityId}
              className="tooltip"
              data-tip={amenity.amenityName}
            >
              <div className="p-1.5 bg-gray-50 rounded-lg">
                <Image
                  src={amenity.amenitiesImageUrl}
                  alt={amenity.amenityName}
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            </div>
          ))}
          {vehicle.amenitiesResponses.length > 4 && (
            <span className="text-xs text-[#0F7BAB] font-medium">
              +{vehicle.amenitiesResponses.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              vehicle.filter.includes("AC")
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {vehicle.filter.includes("AC") ? "AC" : "Non-AC"}
          </span>
          <Link 
            href={`/admin/vehicle/${vehicle.vehicleId}`} 
            className="flex-shrink-0"
          >
            <button className="bg-[#0F7BAB] hover:bg-[#0E6A94] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};