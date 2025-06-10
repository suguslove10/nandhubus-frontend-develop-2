"use client";
import { useBookings } from "@/app/hooks/mybookings/BookingContext";
import { selectAuth } from "@/app/Redux/authSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapPin, Calendar, Users, X, Clock, Map, Download, Package, List, Ticket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDeclineBooking } from "@/app/services/data.service";
import toast from "react-hot-toast";
import { parse } from 'date-fns';
import { BookingDetail } from "@/app/types/bookingdetailsResponse.type";
import { getRequest } from "@/app/services/httpServices";
import { API_CONSTANTS } from "@/app/services/api.route";

const BookingDetails: React.FC = () => {
  const { fetchBookings, bookingData, isError, error } = useBookings();
  const authData = useSelector(selectAuth);
  const mobileNumber = authData.user?.user.mobile;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate: cancelTrip, isPending } = useDeclineBooking();
  const [cancellationReason, setCancellationReason] = useState("");
  
  const router = useRouter();
  useEffect(() => {
    fetchBookings(mobileNumber!);
  }, []);

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
  
    try {
      // Try DD-MM-YYYY first
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        return parse(dateString, 'dd-MM-yyyy', new Date());
      }
      // Try YYYY-MM-DD next
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return parse(dateString, 'yyyy-MM-dd', new Date());
      }
      // Fallback to default parsing
      return new Date(dateString);
    } catch {
      return null;
    }
  };
  
  
  
  const formatDate = (dateString: string) => {
    const date = parseDate(dateString);
    if (!date) return "Invalid Date";
  
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  
  const calculateDuration = (fromDate: string, toDate: string) => {
    const start = parseDate(fromDate);
    const end = parseDate(toDate);
  
    if (!start || !end) return "Invalid Date";
  
    const diffTime = end.getTime() - start.getTime();
    return diffTime >= 0
      ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " days"
      : "Invalid Date Range";
  };
  
  const getFirstWord = (str: string) => {
    if (!str) return "N/A";
    return str.split(",")[0].trim();
  };

  const getSeatCapacity = (vehicle: any) => {
    if (!Array.isArray(vehicle) || vehicle.length === 0) return "N/A";
    return vehicle[0].seatCapacity || "N/A";
  };

  if (isError) {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg text-sm">
        <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-red-800">Failed to load bookings</p>
          <p className="text-red-600">{error?.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

const handleCancel = async (bookingId: string, reason: string) => {
  try {
    await cancelTrip({ bookingId, reason }); // pass as object
    setShowConfirmation(false);
    toast.success("Booking cancelled successfully!");
    fetchBookings(mobileNumber!);
  } catch (error) {
    toast.error("Failed to cancel booking. Please try again.");
  }
};



  
  // Add this type definition
type InvoiceType = "invoice" | "proforma Invoice" | "re-schedule Invoice";

// Add this state for tracking downloads
const [downloadState, setDownloadState] = useState<{
  bookingId: string | null;
  type: InvoiceType | null;
  isLoading: boolean;
  progress: number;
}>({
  bookingId: null,
  type: null,
  isLoading: false,
  progress: 0,
});

// Helper function to determine document type
const getDocumentType = (trip: BookingDetail): InvoiceType => {
  if (trip.bookingStatus === "Rescheduled") return "re-schedule Invoice";
  return "invoice";
};


// Helper function to get display name for document
const getDocumentName = (type: InvoiceType): string => {
  switch(type) {
    case "invoice": return "Invoice";
    case "re-schedule Invoice": return "Reschedule Invoice";
    default: return "Document";
  }
};

// Download handler
const downloadInvoiceReport = async (bookingId: string, type: InvoiceType) => {
  try {
    const response = await getRequest(
      API_CONSTANTS.DOWNLOAD_REPORT(bookingId, type),
      { responseType: "blob" }
    );
    return response;
  } catch (error) {
    console.error(`Error downloading ${type} report:`, error);
    throw error;
  }
};

const handleInvoiceClick = async (e: React.MouseEvent, trip: BookingDetail) => {
  e.stopPropagation();
  
  const documentType = getDocumentType(trip);
  
  setDownloadState({
    bookingId: trip.bookingId,
    type: documentType,
    isLoading: true,
    progress: 0,
  });

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setDownloadState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }));
    }, 200);

    const response = await downloadInvoiceReport(trip.bookingId, documentType);

    clearInterval(progressInterval);
    setDownloadState(prev => ({ ...prev, progress: 100 }));

    if (response instanceof Blob) {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentType}_${trip.bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${getDocumentName(documentType)} downloaded successfully!`);
    }
  } catch (error) {
    toast.error(`Failed to download document. Please try again.`);
  } finally {
    setTimeout(() => {
      setDownloadState({
        bookingId: null,
        type: null,
        isLoading: false,
        progress: 0,
      });
    }, 300);
  }
};

  const renderBookingCard = (booking: any, isCancelled: boolean = false) => (
    
    <div key={booking.bookingId} className="border rounded-lg overflow-hidden mb-4">
      <div className="flex items-start gap-3 p-3">
        <div className="flex flex-col justify-center space-y-[7px] py-1 w-full">
          {/* First line: Logo and Status */}
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Image src="/assests/Logo.png" alt="Logo" width={40} height={40} />
            </div>
            <div className="flex-grow" />
            <span className={`text-[13px] px-1.5 py-0.5 rounded ${
              isCancelled 
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}>
              {isCancelled ? "Canceled" : booking.bookingStatus}
            </span>
          </div>

         
      {/* Second line: Source → Destination */}
      <div className={`text-[12px] font-medium whitespace-nowrap flex justify-center ${
        booking.packageDetails ? "text-blue-600" : ""
      }`}>
        {getFirstWord(booking.source)} → {getFirstWord(booking.destination)}
      </div>

      {/* Third line: Date */}
      <div className="flex items-center text-[13px] gap-2 text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="flex-shrink-0 text-gray-500" />
          <span>{formatDate(booking.slots.fromDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="flex-shrink-0 text-gray-500" />
          <span>{formatDate(booking.slots.toDate)}</span>
        </div>
      </div>
  
      {/* Fourth line: Duration */}
   
     
      <div>
        {booking.packageDetails?.days ? (
           <div className="flex  items-center gap-1.5 text-xs w-fit pr-2    text-blue-600 bg-blue-50 py-1 rounded-md ">
             <Package size={14} className="flex-shrink-0"/>
  <span>
      
   
    {booking.packageDetails.days} day package
  </span>
  </div>
  

):(    <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
  <Clock size={14} className="flex-shrink-0 text-gray-500" />
 <span>{calculateDuration(booking.slots.fromDate, booking.slots.toDate)}</span>
 </div>
)}

      </div>

      {/* Fifth line: Pickup Location */}
      <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
        <MapPin size={14} className="flex-shrink-0 text-gray-500" />
        <span>{getFirstWord(booking.destination)}</span>
      </div>
      {booking.packageDetails?.places && (
  <div className="flex items-start gap-1.5 text-xs text-blue-600  py-1 max-w-full overflow-hidden">
    <Ticket size={14} className="flex-shrink-0" />
    <span className="break-words">
      {booking.packageDetails.places}
    </span>
  </div>
)}


      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
          <Users size={14} className="flex-shrink-0 text-gray-500" />
          <span>{getSeatCapacity(booking.vehicle)}</span>
        </div>
        
        {/* Invoice Button */}
        <button
          onClick={(e) => handleInvoiceClick(e, booking)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition"
          disabled={downloadState.isLoading && downloadState.bookingId === booking.bookingId}
        >
          <Download size={14} className="flex-shrink-0" />
          <span>
            {downloadState.isLoading && downloadState.bookingId === booking.bookingId 
              ? `${downloadState.progress}%` 
              : 'Invoice'}
          </span>
        </button>
      </div>

      {isCancelled ? (
        <div className="pt-2 text-[12px] text-red-600 font-medium border border-gray-300 rounded-md px-3 py-2">
          This booking is already canceled.
        </div>
      ) : (
        <div className="pt-2 flex justify-between">
          {booking.bookingStatus === "Rescheduled" ? (
            <button
              className="text-xs rounded text-gray-600 transition underline"
            >
              Already Rescheduled
            </button>
          ) : (
            <button
              onClick={() => router.push("/myaccount/mytrips")}
              className="text-xs px-2 py-0.5 border rounded text-blue-600 hover:bg-blue-50 transition border-gray-200"
            >
              Reschedule
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmation(true)}
            className="text-xs px-2 py-0.5 border rounded text-red-600 hover:bg-red-50 transition border-gray-200"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  </div>

  {showConfirmation && !isCancelled && (
  <div className="mt-3 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
    <p className="text-sm text-gray-700 font-medium text-center mb-3">
      Are you sure you want to cancel the booking?
    </p>
    
    <select 
      className="w-full p-2 mb-3 border border-gray-300 rounded-md text-sm"
      onChange={(e) => setCancellationReason(e.target.value)}
      value={cancellationReason}
    >
      <option value="">Select cancellation reason</option>
      <option value="Change of plans">Change of plans</option>
      <option value="Found better option">Found better option</option>
      <option value="Price too high">Price too high</option>
      <option value="Travel dates changed">Travel dates changed</option>
      <option value="Other reason">Other reason</option>
    </select>
    
    <div className="flex justify-center gap-4 mt-3">
      <button
        className="text-xs px-4 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-400"
        onClick={() => handleCancel(booking.bookingId, cancellationReason)}
        disabled={isPending || !cancellationReason}
      >
        {isPending ? "Cancelling..." : "Yes"}
      </button>
      <button
        className="text-xs px-4 py-1 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
        onClick={() => {
          setShowConfirmation(false);
          setCancellationReason("");
        }}
      >
        No
      </button>
    </div>
  </div>
)}

    </div>
  );

  return (
    <div className="space-y-3 text-sm pb-[8rem]">
      {!bookingData ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-8 w-8"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Active Bookings */}
          {bookingData.bookedList?.length > 0 && (
            <div className="space-y-3">
              {bookingData.bookedList.map((booking) => renderBookingCard(booking))}
            </div>
          )}
          
          {/* Cancelled Bookings */}
          {bookingData.cancelledList?.length > 0 && (
            <div className="space-y-3">
              {bookingData.cancelledList.map((booking) => renderBookingCard(booking, true))}
            </div>
          )}
          
          {/* No bookings message */}
          {(bookingData.bookedList?.length === 0 && bookingData.cancelledList?.length === 0) && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <p>No bookings found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingDetails;