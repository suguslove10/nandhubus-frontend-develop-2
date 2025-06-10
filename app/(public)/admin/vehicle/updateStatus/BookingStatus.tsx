'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { updateTripStatus, useFetchBookingInfo } from '@/app/services/data.service';
import { declineBookingRequest } from '@/app/services/data.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const BookingStatus = () => {
  const [bookingId, setBookingId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  
  const { mutate: fetchBookingInfo, data, isError, isPending } = useFetchBookingInfo();

const { mutate: declineBooking } = useMutation({
  mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
    declineBookingRequest(bookingId, reason),
  onSuccess: () => {
    setUpdateSuccess(true);
    fetchBookingInfo(bookingId);
    toast.success("Booking cancelled successfully");
  },
  onError: () => {
    setUpdateError('Failed to cancel booking. Please try again.');
    toast.error("Error cancelling booking");
  }
});


  const handleFetchBooking = () => {
    if (bookingId.trim() === "") {
      alert('Please enter a Booking ID.');
      return;
    }
    setUpdateSuccess(false);  // Reset success state
    setUpdateError('');       // Reset error state
    fetchBookingInfo(bookingId);
  };

  const handleUpdateStatus = async () => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      if (selectedStatus === 'Cancelled') {
        // Use the decline booking API for cancellation
        declineBooking({ bookingId: data[0].bookingId, reason: 'Cancelled by admin' });
      } else {
        // Use the regular status update for other statuses
        await updateTripStatus(data[0].bookingId, selectedStatus);
        setUpdateSuccess(true);
        fetchBookingInfo(data[0].bookingId);
      }
    } catch (error) {
      setUpdateError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  type VehicleType = {
    vehicleNumber: string;
    seatCapacity: number;
    vehicleAC: string;
    sleeper: string;
  };

  // Determine available status options based on current booking status
  const getStatusOptions = () => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    const currentStatus = data[0].bookingStatus;
    
    switch (currentStatus) {
      case 'Enquiry':
        return []; 
      case 'Booked':
        return ['Cancelled', 'Completed'];
      case 'Cancelled':
        return []; // No options for Cancelled
      case 'Rescheduled':
        return ['Cancelled', 'Completed'];
        case 'Completed':
          return [];
          default:
        return [];
    }
  };

  const statusOptions = getStatusOptions();
  const currentStatus = data && Array.isArray(data) && data.length > 0 ? data[0].bookingStatus : null;
  const canUpdateStatus = statusOptions.length > 0;

  return (
    <div className="bg-[#f9fbfc] flex flex-col items-center justify-center px-7 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0f7bab]">
          Booking Status Management
        </h1>
        <p className="mt-2 text-gray-500 text-sm sm:text-base">
          Enter a booking ID to update or view its current status
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Enter booking ID"
              className="w-full pl-10 border-b-2 border-gray-300 focus:border-[#0f7bab] focus:outline-none py-2 text-sm text-gray-700 placeholder-gray-400 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchBooking()}
            />
          </div>
        </div>

        <button
          onClick={handleFetchBooking}
          disabled={isPending}
          className={`w-full flex items-center justify-center gap-2 bg-[#0f7bab] hover:bg-[#0d6d99] text-white font-semibold py-3 rounded-lg transition duration-300 ${
            isPending ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search Booking
            </>
          )}
        </button>

        {/* Display booking information or error */}
        {data && Array.isArray(data) && data.length > 0 && (
          <div className="mt-6 w-full bg-white rounded-xl shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0f7bab]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
              </svg>
              Booking Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <span className="font-medium">Booking ID</span>
                </div>
                <p className="text-[#0f7bab] font-semibold text-base">{data[0].bookingId}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Booking Date</span>
                </div>
                <p className="text-gray-800 text-[14px]">{data[0].bookingDate}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Current Status</span>
                </div>
                <p className="text-gray-800 text-[14px] capitalize">{currentStatus?.toLowerCase()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0f7bab]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Vehicle Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data[0].vehicle.map((v: VehicleType, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Bus {index + 1}
                      </span>
                      <p className="text-sm font-semibold text-gray-700">{v.vehicleNumber}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-gray-600">Type: {v.vehicleAC} {v.sleeper}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-600">Capacity: {v.seatCapacity} seats</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {statusOptions.length > 0 ? (
              <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4">
                <div className="relative w-full sm:w-auto">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-[#0f7bab] focus:border-[#0f7bab] text-sm"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || !selectedStatus}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f7bab] hover:bg-[#0d6d99] text-white font-medium px-6 py-2.5 rounded-lg transition ${
                    isUpdating || !selectedStatus ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Status
                    </>
                  )}
                </button>
              </div>
            ) : (
              !updateSuccess && (  // Only show notice if not in success state
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="text-yellow-800 font-medium">Notice</h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    {currentStatus === 'Enquiry' && (
                      <>This booking is still in enquiry status. No updates can be made at this time.</>
                    )}
                    {currentStatus === 'Declined' && (
                      <>This booking is already cancelled. No further status updates are available for this booking.</>
                    )}
                    {currentStatus === 'Completed' && (
                      <>This booking is already completed. No updates can be made at this time.</>
                    )}
                  </p>
                </div>
              )
            )}

            {/* Update status messages */}
            {updateSuccess && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-green-800 font-medium">Success</p>
                  <p className="text-green-700 text-sm">Status updated successfully!</p>
                </div>
              </div>
            )}
            {updateError && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{updateError}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {isError && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="mt-2 text-sm text-red-700">
              Failed to fetch booking information. Please check the ID and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;