'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Users, Clock, Calendar, MapPin, CheckCircle, Clipboard, CreditCard } from 'lucide-react';
import { BookingDetail } from '@/app/types/bookingdetailsResponse.type';

const TripDetailsModal = ({ trip, isOpen, onClose }: { trip: BookingDetail; isOpen: boolean; onClose: () => void }) => {
  const [showDetails, setShowDetails] = useState(false);

  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl rounded-xl p-3 bg-white shadow-xl border border-gray-200">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#032c3d] to-[#065a76] text-white p-4 md:p-6 rounded-xl flex flex-col gap-2">
          <DialogTitle className="text-lg md:text-xl font-semibold">Trip Details</DialogTitle>
          <div className="text-md md:text-lg font-semibold flex items-center gap-2">
  <span className="w-[18px] h-[18px] flex items-center justify-center">
    <MapPin size={18} className="text-yellow-300 flex-shrink-0" />
  </span>
  <span className="text-[14px] text-white" title={`${trip.source} → ${trip.destination}`}>
    {truncateWords(trip.source, 3)} → {truncateWords(trip.destination, 3)}
  </span>
</div>

          <div className="flex items-center text-sm md:text-base opacity-85">
          <Calendar size={16} className="mr-2 text-yellow-300" /> 
{new Date(trip?.slots?.fromDate).toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric', 
  hour12: true 
})} - 
{new Date(trip?.slots?.toDate).toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric', 
  hour12: true 
})}
          </div>
        </div>

        {/* Content Section */}
        <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-3 space-y-5">

          {/* Vehicle List Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-base md:text-lg">Booked Vehicles:</h3>
            {trip.vehicle.map((vehicle, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 className="text-gray-900 font-semibold text-sm md:text-base">{vehicle?.vehicleName}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs md:text-sm">
                  <div>
                    <p className="text-gray-500">Type: {vehicle?.vehicleAC} {vehicle?.sleeper}</p>
                    <p className="text-gray-500">Number: {vehicle?.vehicleNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Capacity: {vehicle?.seatCapacity} seats</p>
                    {/* <p className="text-gray-500">ID: {vehicle?.vehicleId}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Indicator */}
          {trip.bookingStatus === 'completed' && (
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm md:text-base">
              <CheckCircle size={16} />
              Trip Completed
            </div>
          )}

          {/* Toggle Additional Ticket Details */}
          {showDetails && (
            <div className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm mt-3 text-xs md:text-sm space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">Booking #:</span>
                <span className="flex items-center gap-1 text-blue-600">
                  <Clipboard size={14} /> {trip.bookingId}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Advance Paid:</span>
                <span className="text-green-600 font-medium">₹{trip.advancedPaid?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Remaining Amount:</span>
                <span className="text-red-500 font-medium">₹{trip.remainingAmt?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg font-semibold text-gray-900">
                <span>Total Fare:</span>
                <span>₹{trip.totalAmt?.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 text-[#0f7bab] border-none rounded-xl font-semibold text-sm md:text-base underline hover:scale-105 transition-all cursor-pointer"
        >
          {showDetails ? 'Hide Booking Details' : 'View Booking Details'}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsModal;