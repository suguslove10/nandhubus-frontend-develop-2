"use client";
import Swal from "sweetalert2";
import {
  CalendarX,
  CalendarCheck,
  Users,
  BusFront,
  Calendar1,
  FileText,
  Download,
  Package,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JSX, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Image from "next/image";
import TripDetailsModal from "./tripDetails";
import { useBookings } from "@/app/hooks/mybookings/BookingContext";
import { useDispatch, useSelector } from "react-redux";
import { authSlice, selectAuth } from "@/app/Redux/authSlice";
import { addDays, differenceInCalendarDays, isSameDay, parse, set, subDays } from "date-fns";
import { CalendarIcon, Bus, ArrowRight } from "lucide-react";
import { BookingDetail } from "@/app/types/bookingdetailsResponse.type";
import {
  addReview,
  declineBookingRequest,
  distanceCalculation,
  downloadInvoiceReport,
  getRefundAmountById,
  packageVehicleList,
  updateReview,
  useDeclineBooking,
  useRescheduleBooking,
} from "@/app/services/data.service";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppDispatch } from "@/app/Redux/store";
import { fetchListVehiclesData } from "@/app/Redux/list";
import { setSearchDetails } from "@/app/Redux/searchSlice";
import { fetchPackageVehicles } from "@/app/Redux/packagevehcleslice";
import toast from "react-hot-toast";
import { useDistance } from "@/app/context/DistanceContext";
import { useLoader } from "@/app/context/LoaderContext";
import { getRequest } from "@/app/services/httpServices";
import { API_CONSTANTS } from "@/app/services/api.route";
import logo_img from "../../../assests/images/nandu tours and travels logo png.png";
import { FaInfoCircle } from "react-icons/fa";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { RiVideoLine } from "react-icons/ri";

  
  
interface ReviewDataRequest {

  bookingId: string;
  vehicleId: string;
  rating: number;
  reviewDescription: string;
}
  interface ReviewUpdateDataRequest {
  reviewId: string; // Add this for updates
  bookingId: string;
  vehicleId: string;
  rating: number;
  reviewDescription: string;
}


 



export default function MyTrips() {
  const auth = useSelector(selectAuth);
  const { getBookings, bookingData } = useBookings();
  const router=useRouter();

  useEffect(() => {
    if (auth?.user?.user?.mobile) {
      getBookings(auth.user.user.mobile);
    }
  }, []);
  const [tripsData, setTripsData] = useState({
    upcoming: bookingData?.bookedList || [],
    past: bookingData?.historyList || [],
    cancelled: bookingData?.cancelledList || []
  });
  useEffect(() => {
    if (bookingData) {
      setTripsData({
        upcoming: bookingData?.bookedList || [],
        past: bookingData?.historyList || [],
        cancelled: bookingData?.cancelledList || []
      });
    }
  }, [bookingData]);
    // Function to handle trip cancellation
  const handleTripCancellation = (bookingId: string) => {
  setTripsData(prev => ({
    upcoming: prev.upcoming.filter((trip: BookingDetail) => trip.bookingId !== bookingId),
    past: prev.past,
    cancelled: [...prev.cancelled, ...prev.upcoming.filter((trip: BookingDetail) => trip.bookingId === bookingId)]
  }));
};

  const [selectedTab, setSelectedTab] = useState("upcoming");

  const upcomingTrips = bookingData?.bookedList ?? [];
  const cancelledTrips = bookingData?.cancelledList ?? [];
  const pastTrips = bookingData?.historyList ?? [];

  const [selectedTrip, setSelectedTrip] = useState<BookingDetail | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
    <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="flex p-0.5 bg-[#0f7bab] rounded-full w-full max-w-md mx-auto shadow-md">
        <TabsTrigger
          value="upcoming"
          className={`flex-1 text-center py-2 text-sm md:text-base rounded-full transition-all ${
            selectedTab === "upcoming"
              ? "bg-white text-[#0f7bab] font-semibold"
              : "text-white cursor-pointer"
          }`}
        >
          Upcoming
        </TabsTrigger>
        <TabsTrigger
          value="past"
          className={`flex-1 text-center py-2 text-sm md:text-base rounded-full transition-all ${
            selectedTab === "past"
              ? "bg-white text-[#0f7bab] font-semibold"
              : "text-white cursor-pointer"
          }`}
        >
          Past
        </TabsTrigger>
        <TabsTrigger
          value="cancelled"
          className={`flex-1 text-center py-2 text-sm md:text-base rounded-full transition-all ${
            selectedTab === "cancelled"
              ? "bg-white text-[#0f7bab] font-semibold"
              : "text-white cursor-pointer"
          }`}
        >
          Cancelled
        </TabsTrigger>
      </TabsList>

      {/* Upcoming Trips */}
      <TabsContent value="upcoming">
        {upcomingTrips?.length > 0 ? (
          <TripList
            trips={upcomingTrips}
            router={router}
            setSelectedTrip={setSelectedTrip}
            selectedTrip={selectedTrip!}
            onTripCancelled={handleTripCancellation}
          />
        ) : (
          <NoTripsMessage
            message="You have no upcoming bookings"
            icon={<Calendar1 size={50} />}
          />
        )}
      </TabsContent>

      {/* Past Trips */}
      <TabsContent value="past">
        {pastTrips?.length > 0 ? (
          <TripList
            trips={pastTrips}
            router={router}
            isPast={true}
            setSelectedTrip={setSelectedTrip}
            selectedTrip={selectedTrip!}
          />
        ) : (
          <NoTripsMessage
            message="You have no past trips"
            icon={<CalendarCheck size={50} />}
          />
        )}
      </TabsContent>

      <TabsContent value="cancelled">
        {cancelledTrips.length > 0 ? (
          <TripList
            trips={cancelledTrips}
            router={router}
            isCancelled={true}
            setSelectedTrip={setSelectedTrip}
            selectedTrip={selectedTrip!}
          />
        ) : (
          <NoTripsMessage
            message="You have no cancelled trips"
            icon={<CalendarX size={50} />}
          />
        )}
      </TabsContent>
    </Tabs>
  </div>
  );
}
interface ReviewDataRequest {

  bookingId: string;
  vehicleId: string;
  rating: number;
  reviewDescription: string;
}
const TripList = ({
  trips,
  router,
  isPast,
  isCancelled,
  setSelectedTrip,
  selectedTrip,
  onTripCancelled
}: {
  trips: BookingDetail[];
  router: ReturnType<typeof useRouter>;
  isPast?: boolean;
  isCancelled?: boolean;
  setSelectedTrip: (trip: BookingDetail | null) => void;
  selectedTrip: BookingDetail | null;
  onTripCancelled?: (bookingId: string) => void;
}) => {
  const auth = useSelector(selectAuth);
  const { getBookings, bookingData } = useBookings();
  const { showLoader, hideLoader } = useLoader();
  const lastSelectedDateRef = useRef<Date | null>(null);
  const { mutate: cancelTrip, isPending } = useDeclineBooking(auth?.user?.user.mobile);
  const [showRescheduleUI, setShowRescheduleUI] = useState(false);
  const { mutate: rescheduleBooking } = useRescheduleBooking();
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [selectedRescheduleTrip, setSelectedRescheduleTrip] =
    useState<BookingDetail>();
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const dispatch = useDispatch<AppDispatch>();
   const [sourceCoords, setSourceCoords] = useState<{
      latitude: number;
      longitude: number;
    }>({
      latitude: 0,
      longitude: 0,
    });
    const [viewerMedia, setViewerMedia] = useState<Array<{ id: string; mediaUrl: string; type: 'image' | 'video' }> | null>(null);
const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const { daysFromAPI, callDistanceAPI } = useDistance();
    const [destinationCoords, setDestinationCoords] = useState<{
      latitude: number;
      longitude: number;
    }>({
      latitude: 0,
      longitude: 0,
    });
    const fetchCoordinates = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return { latitude: location.lat, longitude: location.lng };
        } else {
          toast.error("Unable to fetch coordinates for the location.");
          return null;
        }
      } catch (error) {
        toast.error("Error fetching coordinates.");
        return null;
      }
    };
    const formatDateForURL = (dateString: string) => {
      const date = new Date(dateString);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    };
    const {extraDaysCount,setExtraDaysCount}=useDistance();  
    const handleReschedule = async (
      bookingId: string,
      source: string,
      destination: string,
      departureDate: string,
      returnDate: string,
      isPackageBooking: boolean = false
    ) => {
      if (!source || !destination || !departureDate || !returnDate) {
        alert("Please select both start and end dates before proceeding.");
        return;
      }
    
      try {
        showLoader();
    
        const fetchBothCoords = async () => {
          const [sourceResponse, destinationResponse] = await Promise.all([
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(source)}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`),
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`)
          ]);
    
          const sourceData = await sourceResponse.json();
          const destinationData = await destinationResponse.json();
    
          if (!sourceData.results.length || !destinationData.results.length) {
            throw new Error("Failed to fetch coordinates for source or destination");
          }
    
          return {
            sourceLat: sourceData.results[0].geometry.location.lat,
            sourceLng: sourceData.results[0].geometry.location.lng,
            destinationLat: destinationData.results[0].geometry.location.lat,
            destinationLng: destinationData.results[0].geometry.location.lng,
          };
        };
    
        const { sourceLat, sourceLng, destinationLat, destinationLng } = await fetchBothCoords();
    
        const distanceResponse = await distanceCalculation({
          source,
          sourceLatitude: sourceLat,
          sourceLongitude: sourceLng,
          destination,
          destinationLatitude: destinationLat,
          destinationLongitude: destinationLng,
        });
    
        const distanceInKm = distanceResponse.kiloMeter;
    
        // Store booking form data
        const booking_form__data = sessionStorage.getItem("booking_form__data");
        const existingData = booking_form__data ? JSON.parse(booking_form__data) : {};
        const trip = trips.find(t => t.bookingId === bookingId);
        const isMultipleBooking = trip?.vehicle && trip.vehicle.length > 1;
        const packageName = trip?.packageDetails?.packageName || '';
    
        const updatedBookingFormData = {
          ...existingData,
          source,
          destination,
          fromDate: departureDate,
          toDate: returnDate,
          distanceInKm,
          sourceLatitude: sourceLat,
          sourceLongitude: sourceLng,
          destinationLatitude: destinationLat,
          destinationLongitude: destinationLng,
          tripExtraDays: extraDaysCount,
          isReschedule: true,
          isMultiReschedule: isMultipleBooking,
          bookingId,
        };
    
        sessionStorage.setItem("booking_form__data", JSON.stringify(updatedBookingFormData));
    
        await dispatch(setSearchDetails({
          source,
          destination,
          fromDate: departureDate,
          toDate: returnDate,
        }));
    

    
        if (isPackageBooking) {
          // Store complete package data before navigation
          const packageFormData = {
            fromDate: departureDate,
            toDate: returnDate,
            packageTitle: packageName,
            source,
            sourceLatitude: sourceLat,
            sourceLongitude: sourceLng,
            destination,
            destinationLatitude: destinationLat,
            destinationLongitude: destinationLng,
            days: daysFromAPI?.numberOfDays || 0,
            isReschedule: true,
            bookingId
          };
    
          sessionStorage.setItem("package_form__data", JSON.stringify(packageFormData));
    
          // Dispatch after storing data
          await dispatch(
            fetchPackageVehicles({
              fromDate: departureDate,
              packageName: packageName,
              source: source,
              sourceLatitude: sourceLat,
              sourceLongitude: sourceLng,
              isReschedule: true,
              bookingId,
            })
          );
    
          router.push(
            `/packages?adjustTrip=true&bookingId=${bookingId}&source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&fromDate=${departureDate}&toDate=${returnDate}&packageName=${packageName}&isReschedule=true&days=${trip?.packageDetails?.days || 0}`
          );
        } else {
          const vehicleCountParam = isMultipleBooking ? `&vehicleCount=${trip?.vehicle.length}` : '';
          
          router.push(
            `/list?adjustTrip=true${isMultipleBooking ? '&isMultipleBooking=true' : ''}${vehicleCountParam}&bookingId=${bookingId}&source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&fromDate=${formatDateForURL(departureDate)}&toDate=${formatDateForURL(returnDate)}`
          );
        }
    
      } catch (error) {
                alert("Failed to check availability. Please try again.");
      } finally {
        hideLoader();
      }
    };

// true for multiple booking
    

  

  

  type InvoiceType = "invoice" | "proforma Invoice" | "re-schedule Invoice";
const getLastTwoDaysRange = (start: Date, duration: number) => {
    const end = addDays(start, duration+1); // full trip end date
    const from = subDays(end, 1); // second last day
    return {
      min: set(from, { hours: 0, minutes: 0 }),
      max: set(end, { hours: 23, minutes: 59 }),
    };
  };
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
const [selectedTripToReview, setSelectedTripToReview] = useState<BookingDetail | null>(null);
const [showReviewModal, setShowReviewModal] = useState(false);
const [reviewText, setReviewText] = useState('');
const [reviewRating, setReviewRating] = useState(0);
const [isSubmittingReview, setIsSubmittingReview] = useState(false);
   const handleReviewSubmit = async (trip: BookingDetail) => {
    if (!reviewText.trim()) {
      toast.error('Please write your review');
      return;
    }

    setIsSubmittingReview(true);
    try {
    

     const response = await addReview(
  trip.bookingId,
  trip.vehicle.map((vehicle) => vehicle.vehicleId),
  reviewRating,
  reviewText,
   selectedImages.length > 0 ? selectedImages : null,
      selectedVideos.length > 0 ? selectedVideos : null
);
      toast.success('Review submitted successfully!');
      setSelectedTripToReview(null);
      setReviewText('');
      setReviewRating(0);
       setSelectedImages([]);
    setSelectedVideos([]);
      
      // Refresh the booking data to show the review
      if (auth.user?.user.mobile) {
        getBookings(auth.user.user.mobile);
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };
const handleReviewUpdate = async (trip: BookingDetail) => {
  if (!reviewText.trim()) {
    toast.error('Please write your review');
    return;
  }

  if (!trip.vehicle[0].userReviewResponse?.reviewId) return;

  setIsSubmittingReview(true);
  try {
   

    const response = await updateReview(trip.vehicle.map(data => data.userReviewResponse?.reviewId),trip.bookingId,trip.vehicle.map(data => data.vehicleId),reviewRating,reviewText,  selectedImages.length > 0 ? selectedImages : null,
      selectedVideos.length > 0 ? selectedVideos : null);
    toast.success('Review updated successfully!');
    setSelectedTripToReview(null);
    setReviewText('');
    setReviewRating(0);
     setSelectedImages([]);
    setSelectedVideos([]);
    
    // Refresh the booking data to show the updated review
    if (auth.user?.user.mobile) {
      getBookings(auth.user.user.mobile);
    }
  } catch (error) {
    toast.error('Failed to update review. Please try again.');
  } finally {
    setIsSubmittingReview(false);
  }
};

 


  const downloadInvoiceReport = async (bookingId: string, type: InvoiceType) => {
    try {
      const response = await getRequest(
        API_CONSTANTS.DOWNLOAD_REPORT(bookingId, type),
        { responseType: "blob" }
      );
      return response;
    } catch (error) {
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
  
  
  const dateLimits = departureDate ? getLastTwoDaysRange(departureDate, daysFromAPI?.numberOfDays ?? 0) : null;
 
  const [selectedCancelTrip, setSelectedCancelTrip] = useState<BookingDetail | null>(null);
  const isDownloading = (bookingId: string, type?: InvoiceType) => 
    downloadState.isLoading && 
    downloadState.bookingId === bookingId && 
    (!type || downloadState.type === type);

  const getDocumentType = (trip: BookingDetail): InvoiceType => {
    if (trip.bookingStatus === "Rescheduled") return "re-schedule Invoice";
    if (trip.paymentType === "full") return "invoice";
    return "invoice";
  };

  const getDocumentName = (type: InvoiceType) => {
    switch(type) {
      case "proforma Invoice": return " Invoice";
      default: return "Invoice";
    }
  };
  
  
     const [selectedReason, setSelectedReason] = useState<string | null>(null);

  return (
    <div className="mt-4 md:mt-6 space-y-3 md:space-y-4 pb-[70px] md:pb-0">
   {trips

  .map((trip) => {
    const isPast = trip.bookingStatus === "Completed";
    const isCancelled = trip.bookingStatus === "Declined";
    const documentType = getDocumentType(trip);

    const documentName = getDocumentName(documentType);
    const isPackageBooking = trip.packageBooking;
    const isCancellationOpen = selectedCancelTrip?.bookingId === trip.bookingId;
 
    const handleCancellationProcess = async () => {
    if (!selectedReason) {
      toast.error("Please select a cancellation reason.");
      return;
    }

    
    try {
      // First get the refund amount
      const refundMessage = await getRefundAmountById(trip.bookingId);
      
      // Then show SweetAlert with refund information
      const result = await Swal.fire({
        title: 'Confirm Cancellation',
        html: `<p>${refundMessage}</p><p>Are you sure you want to cancel this booking?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0f7bab',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel booking',
        cancelButtonText: 'Go back'
      });
      
      // If user confirmed cancellation, proceed with API call
      if (result.isConfirmed) {
        const response = await declineBookingRequest(trip.bookingId, selectedReason);

        if (onTripCancelled) onTripCancelled(trip.bookingId);
        if (auth.user?.user.mobile) {
          getBookings(auth.user.user.mobile);
        }

        setSelectedCancelTrip(null);
Swal.fire({
      title: 'Booking Cancelled',
      text: 'Your booking has been successfully cancelled.',
      icon: 'success',
      confirmButtonColor: '#0f7bab'
    });      }
    } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'There was a problem cancelling your booking. Please try again.',
      icon: 'error',
      confirmButtonColor: '#0f7bab'
    });
    } finally {
    }
  };


    return (
      <div
        key={trip.bookingId}
        className="bg-white p-4 md:p-5 rounded-lg shadow-md border-l-4 border-[#0f7bab]"
      >
        <div
          className="relative cursor-pointer"
          onClick={() =>
            setSelectedTrip(
              trip.bookingId === selectedTrip?.bookingId ? null : trip
            )
          }
        >
          {/* Passengers count - position adjusted for mobile */}
          <div className="absolute top-2 right-2 md:top-3 md:right-4 flex items-center gap-1 bg-gray-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-gray-700 text-xs md:text-sm shadow">
            <Users size={14} className={trip.packageBooking ? "text-emerald-600" : "text-gray-600"} />
            <span>{trip.vehicle.reduce((sum, vehicle) => sum + vehicle.seatCapacity, 0)}</span>
          </div>

            <div className="flex items-start gap-2 w-full max-w-full overflow-hidden">
            {/* Logo and bus icon container */}
            <div className="flex flex-col items-start">
              <Image
                src={logo_img}
                alt="Logo"
                width={32}
                height={32}
                className="mb-2"
              />

              <div className={`p-2 rounded-full ${
                trip.packageBooking ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-[#0f7bab]'
              }`}>
                {trip.packageBooking ? (
                  <Package size={18} />
                ) : (
                  <BusFront size={18} />
                )}
              </div>
            </div>

            {/* Trip details */}
            <div className="flex-1 ml-1 mt-[32px]">
              {trip.packageBooking && (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full ml-2">
                  Package
                </span>
              )}
              <h3 className="text-sm md:text-lg font-semibold">
                {/* Desktop view - remains inline */}
                <span className="hidden md:inline">
                  {trip.source.split(",")[0]} →{" "}
                  {trip.destination.split(",")[0]}
                </span>

                <span className="md:hidden">
  {(trip.source.split(",")[0].length + trip.destination.split(",")[0].length) > 20 ? (
    // Column layout
    <span className="flex flex-col  text-sm w-full">
    {/* Source */}
    <span
      className="truncate w-[90vw] max-w-full "
      title={trip.source.split(",")[0]}
    >
      {trip.source.split(",")[0].length > 20
        ? trip.source.split(",")[0].slice(0, 20) + "..."
        : trip.source.split(",")[0]}
    </span>
  
    {/* Arrow */}
    <span className="my-1 text-gray-500">↓</span>
  
    {/* Destination */}
    <span
      className="truncate w-[90vw] max-w-full "
      title={trip.destination.split(",")[0]}
    >
      {trip.destination.split(",")[0].length > 20
        ? trip.destination.split(",")[0].slice(0, 20) + "..."
        : trip.destination.split(",")[0]}
    </span>
  </span>
  
  ) : (
    // Inline layout
    <span className="flex items-center text-sm">
      <span
        className="truncate max-w-[35vw]"
        title={trip.source.split(",")[0]}
      >
        {trip.source.split(",")[0]}
      </span>
      <span className="mx-2">→</span>
      <span
        className="truncate max-w-[35vw]"
        title={trip.destination.split(",")[0]}
      >
        {trip.destination.split(",")[0]}
      </span>
    </span>
  )}
</span>

              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 font-medium">Booking ID:</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {trip.bookingId}
                </span>
              </div>
              <p className="text-gray-600 text-xs md:text-sm">
                {new Date(trip.slots.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - 
                {new Date(trip.slots.toDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {/* Vehicle List */}
              <div className="mt-1 space-y-1">
  {trip.vehicle.map((vehicle, index) => (
    <div 
      key={`${trip.bookingId}-${index}`} 
      className="flex items-start gap-2 w-full"
    >
      <BusFront size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="flex flex-col text-gray-500 text-xs md:text-sm font-medium break-words whitespace-normal leading-snug">
        <span>{vehicle.vehicleName}</span>
        <span className="text-gray-400">
          {vehicle.vehicleNumber} - {vehicle.seatCapacity} seats
        </span>
      </div>
    </div>
  ))}
  
</div>

{/* Rescheduling warning - moved here from reschedule button section */}
{!isPast && !isCancelled && (() => {
  const currentDate = new Date();
  const departure = new Date(trip.slots.fromDate);
  const diffInTime = departure.getTime() - currentDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);
  const isDisabled = diffInDays <= 3 ;
  const isMultiple=trip.vehicle.length>1;
  
  return isDisabled ? (
   <div className="mt-1 flex items-center gap-1">
    <BsFillInfoCircleFill className="text-red-500 text-sm" />
    <span className="text-gray-900 text-xs">
        Rescheduling prohibited within 3 days of departure
    </span>
  </div>
  ) : null;
})()}


              {trip.packageBooking && trip.packageDetails ? (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 font-medium">
                        {trip.packageDetails.days} Days / {trip.packageDetails.days - 1} Nights
                      </p>
                      {trip.packageDetails.places ? (
             <div className="flex flex-wrap gap-1 mt-1 text-[0.7rem]">
  {trip.packageDetails.places.split(',').map((place, index) => (
    <span
      key={index}
      className="inline-block px-2 py-0.5 rounded font-medium bg-green-100 text-green-800 whitespace-nowrap overflow-hidden text-ellipsis"
      style={{ maxWidth: '50vw' }}
    >
      {place.trim()}
    </span>
  ))}
</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

{isCancelled && (
  <div className="mt-0 gap-9">
   
    <div className="mt-1 text-xs text-gray-600">
      {trip.refundAmount > 0 ? (
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          ₹{trip.refundAmount.toLocaleString('en-IN')} will be refunded as per the cancellation policy.
        </span>
      ) : (
        <span className="flex items-center gap-1 text-gray-900">
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          No amount will be refunded as per the cancellation policy.
        </span>
      )}
    </div>
    <span className="inline-block text-xs font-semibold text-white bg-red-600 mt-4 px-2 py-0.5 rounded-md">
      CANCELLED
    </span>
  </div>
)}
            </div>
          </div>

          {/* Action Buttons (only for upcoming trips) */}
          {!isPast && !isCancelled && (
            <div className="mt-4 md:mt-6 flex gap-3 md:gap-6 justify-end">
              {/* Download Invoice Button */}
              <button
                className={`flex items-center gap-1 text-blue-600 text-xs md:text-sm ${
                  isDownloading(trip.bookingId) ? 'opacity-50 cursor-wait' : 'underline hover:text-blue-800'
                } transition-all`}
                onClick={(e) => handleInvoiceClick(e, trip)}
                disabled={isDownloading(trip.bookingId)}
              >
                {isDownloading(trip.bookingId) ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    Downloading ({downloadState.progress}%)
                  </>
                ) : (
                  <>
                    <Download size={15} /> {documentName}
                  </>
                )}
              </button>
              <button
              className={`flex items-center gap-1 text-red-600 text-xs md:text-sm underline transition-all ${
                isPending ? "opacity-50 cursor-not-allowed" : "hover:text-red-800"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCancelTrip(isCancellationOpen ? null : trip);
              }}
              disabled={isPending}
            >
              <CalendarX size={12} />
              {isPending ? "Cancelling..." : "Cancel"}
            </button>

              {/* Reschedule Button */}
    {/* Reschedule Button */}
{trip.bookingStatus === "Rescheduled" ? (
  <span className="text-[#999] text-xs md:text-sm">
    Already rescheduled
  </span>
) : (() => {
  const currentDate = new Date();
  const departure = new Date(trip.slots.fromDate);
  const diffInTime = departure.getTime() - currentDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);
  const isDisabled = diffInDays <= 3||trip.couponApplied === true ;

  return (
    <button
      className={`flex items-center gap-1 text-xs md:text-sm underline transition-all ${
        isDisabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-[#0f7bab] hover:text-[#01374e]"
      }`}
      disabled={isDisabled}
      onClick={async (e) => {
        e.stopPropagation();
        if (isDisabled) return;

        const isOpening = selectedRescheduleTrip?.bookingId !== trip?.bookingId;

        if (isOpening) {
          setDepartureDate(null);
          setReturnDate(null);

          const source = await fetchCoordinates(trip.source);
          const destination = await fetchCoordinates(trip.destination);

          if (source && destination) {
            setSourceCoords(source);
            setDestinationCoords(destination);
            callDistanceAPI(trip.source, trip.destination, source, destination);
          }
        } else {
          setDepartureDate(null);
          setReturnDate(null);
        }

        setSelectedRescheduleTrip(isOpening ? trip : undefined);
      }}
    >
      <CalendarCheck size={12} />
      Reschedule
    </button>
  );
})()}

            </div>
          )}

          {/* For past or cancelled trips, show only the invoice option */}
      
{(isPast) && (
  <div className="mt-4 md:mt-6 flex gap-3 md:gap-6 justify-end">
    <button
      className={`flex items-center gap-1 text-blue-600 text-xs md:text-sm ${
        isDownloading(trip.bookingId) ? 'opacity-50 cursor-wait' : 'underline hover:text-blue-800'
      } transition-all`}
      onClick={(e) => handleInvoiceClick(e, trip)}
      disabled={isDownloading(trip.bookingId)}
    >
      <Download size={15} /> {documentName}
    </button>
    
    {/* Add this Write Review button */}
    {!trip.vehicle[0]?.userReviewResponse?.reviewId ? (
      <button
        className="flex items-center gap-1 text-green-600 text-xs md:text-sm underline hover:text-green-800 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTripToReview(trip);
        }}
      >
        <FileText size={15} />
        Write Review
      </button>
    ):
      <button
        className="flex items-center gap-1 text-green-600 text-xs md:text-sm underline hover:text-green-800 transition-all"
  onClick={(e) => {
    e.stopPropagation();
    setShowReviewModal((prev) => !prev); // 👈 toggles the state
  }}
>
        <FileText size={15} />
     Review
      </button>}
  </div>
)}
        </div>
          {/* Add this review section at the bottom of the trip container */}
         

{isPast && (
   <div className="mt-4 pt-4 border-t border-gray-200">
    {trip.vehicle[0]?.userReviewResponse?.reviewId && showReviewModal ? (
      // Existing review - show with edit option
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < trip.vehicle[0]?.userReviewResponse.rating ? '★' : '☆'}</span>
            ))}
          </div>

          <button
            onClick={() => {
              setSelectedTripToReview(trip);
              setReviewText(trip.vehicle[0]?.userReviewResponse.description);
              setReviewRating(trip.vehicle[0]?.userReviewResponse.rating);
            }}
            className="text-xs text-[#0f7bab] hover:text-[#01374e] underline"
          >
            Edit Review
          </button>
        </div>
        <p className="mt-1 text-gray-700">{trip.vehicle[0]?.userReviewResponse.description}</p>
        
        {/* Media Display */}
        {(trip.vehicle[0]?.userReviewResponse.images?.length > 0 || 
         trip.vehicle[0]?.userReviewResponse.videos?.length > 0) && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Media</h4>
            <div className="flex flex-wrap gap-3">
              {/* Images */}
              {trip.vehicle[0]?.userReviewResponse.images?.map((image, index) => (
                <div 
                  key={image.id} 
                  className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer"
                  onClick={() => {
                    const allMedia = [
                      ...(trip.vehicle[0]?.userReviewResponse.images?.map(img => ({
                        id: img.id,
                        mediaUrl: img.mediaUrl,
                        type: 'image' as const
                      })) || []),
                      ...(trip.vehicle[0]?.userReviewResponse.videos?.map(vid => ({
                        id: vid.id,
                        mediaUrl: vid.mediaUrl,
                        type: 'video' as const
                      })) || [])
                    ];
                    setViewerMedia(allMedia);
                    setViewerIndex(allMedia.findIndex(m => m.id === image.id));
                  }}
                >
                  <img
                    src={image.mediaUrl}
                    alt="Review image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-20 transition-all" />
                </div>
              ))}
              
              {/* Videos */}
              {trip.vehicle[0]?.userReviewResponse.videos?.map((video, index) => (
                <div 
                  key={video.id} 
                  className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer"
                  onClick={() => {
                    const allMedia = [
                      ...(trip.vehicle[0]?.userReviewResponse.images?.map(img => ({
                        id: img.id,
                        mediaUrl: img.mediaUrl,
                        type: 'image' as const
                      })) || []),
                      ...(trip.vehicle[0]?.userReviewResponse.videos?.map(vid => ({
                        id: vid.id,
                        mediaUrl: vid.mediaUrl,
                        type: 'video' as const
                      })) || [])
                    ];
                    setViewerMedia(allMedia);
                    setViewerIndex(allMedia.findIndex(m => m.id === video.id));
                  }}
                >
                  <video
                    src={video.mediaUrl}
                    className="w-full h-full object-cover pointer-events-none"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-20 transition-all" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <p className="mt-1 text-xs text-gray-500">
          Reviewed on {new Date(trip.vehicle[0]?.userReviewResponse.createdAt).toLocaleDateString()}
          {trip.vehicle[0]?.userReviewResponse.createdAt && (
            <span> (updated on {new Date(trip.vehicle[0]?.userReviewResponse.createdAt).toLocaleDateString()})</span>
          )}
        </p>
      </div>
    ) : (
     
    ''
    )}

    {/* Review Form (shown when editing or writing new review) */}
    {selectedTripToReview?.bookingId === trip.bookingId && (
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-gray-700 mb-1">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setReviewRating(star)}
                className={`text-xl ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            {trip.vehicle[0]?.userReviewResponse?.reviewId ? 'Edit Your Review' : 'Your Review'}
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Share your experience..."
          />
        </div>
 <div>
      <label className="block text-gray-700 mb-1">Upload Images (optional)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
          }
        }}
        className="w-full p-2 border border-gray-300 rounded-md text-sm"
      />
      {selectedImages?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedImages.map((file, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <span className="text-xs truncate max-w-xs">{file.name}</span>
              <button
                onClick={() => {
                  setSelectedImages(selectedImages.filter((_, i) => i !== index));
                }}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Video Upload */}
    <div>
      <label className="block text-gray-700 mb-1">Upload Videos (optional)</label>
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            setSelectedVideos(Array.from(e.target.files));
          }
        }}
        className="w-full p-2 border border-gray-300 rounded-md text-sm"
      />
      {selectedVideos?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedVideos.map((file, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <span className="text-xs truncate max-w-xs">{file.name}</span>
              <button
                onClick={() => {
                  setSelectedVideos(selectedVideos.filter((_, i) => i !== index));
                }}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedTripToReview(null);
              setReviewText('');
              setReviewRating(5);
            }}
            className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md"
            disabled={isSubmittingReview}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (trip.vehicle[0]?.userReviewResponse?.reviewId) {
                // Update existing review
                handleReviewUpdate(trip);
              } else {
                // Submit new review
                handleReviewSubmit(trip);
              }
            }}
            disabled={isSubmittingReview}
            className="px-3 py-1.5 text-sm bg-[#0f7bab] text-white rounded-md flex items-center gap-1"
          >
            {isSubmittingReview ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {trip.vehicle[0]?.userReviewResponse?.reviewId? 'Updating...' : 'Submitting...'}
              </>
            ) : trip.vehicle[0]?.userReviewResponse?.reviewId ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </div>
    )}  {viewerMedia && viewerIndex !== null && (
      <MediaViewer 
        media={viewerMedia}
        initialIndex={viewerIndex}
        onClose={() => {
          setViewerMedia(null);
          setViewerIndex(null);
        }}
      />
    )}
  </div>
)}

          
        

        {isCancellationOpen && (
  <div className="p-4 sm:p-5 bg-white rounded-xl shadow-lg border border-gray-400 mt-4">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Cancel Booking</h3>
    
    <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
      {/* Cancellation Reasons */}
      <div className="flex-1">
        <h4 className="text-xs sm:text-sm font-medium underline text-gray-700 mb-2 sm:mb-3">Why are you cancelling?</h4>
        <div className="space-y-2 sm:space-y-3">
          {[
            "Change of plans",
            "Found better option",
            "Price too high",
            "Travel dates changed",
            "Other reason"
          ].map((reason) => (
            <label key={reason} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="cancellationReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-800">{reason}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="flex-1 md:border-l md:border-gray-200 md:pl-6">
        <h4 className="text-base sm:text-lg font-medium text-blue-900 mb-2 sm:mb-3">Cancellation Policy</h4>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          {trip.vehicle && trip.vehicle[0]?.policies
            ?.find(policy => policy.policyDescription === "Cancellation Policy")
            ?.policyData?.map((item, index) => (
              <div key={index} className="flex gap-1 sm:gap-2 mb-1 sm:mb-2 last:mb-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600">{item.policyMessage}</p>
              </div>
            )) || (
              <div className="flex gap-1 sm:gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600">No specific cancellation policy available. Please contact customer support.</p>
              </div>
            )
          }
        </div>

        {/* Additional policy details */}
        {trip.vehicle && trip.vehicle[0]?.policies?.some(p => p.policyDescription === "Policy Details") && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs sm:text-sm text-blue-800">
              {trip.vehicle[0]?.policies
                ?.find(p => p.policyDescription === "Policy Details")
                ?.policyData?.[0]?.policyMessage}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
      <button
        onClick={() => setSelectedCancelTrip(null)}
        className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Go Back
      </button>
      <button
        onClick={handleCancellationProcess}
        disabled={isPending}
        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0f7bab] hover:bg-[#0f7bab] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cancelling...
          </>
        ) : "Confirm Cancellation"}
      </button>
    </div>
  </div>
)}

          {/* Reschedule UI - now properly responsive */}
         {/* Reschedule UI - now properly responsive */}
{selectedRescheduleTrip?.bookingId === trip?.bookingId && (
  <div className="p-3 md:p-4 bg-gray-50 rounded-lg mt-3 md:mt-4">
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end md:gap-4">
      {/* New Start Date */}
      <div className="flex-1">
        <label className="block text-[#01374e] text-sm md:text-base font-medium mb-1">
          New Start Date
        </label>
        <div className="relative flex items-center">
          <CalendarIcon
            className="absolute left-3 text-gray-500"
            size={16}
          />
          <DatePicker
            selected={departureDate}
            onChange={(date) => {
              if (!date) return;

              // Get the minimum allowed date from trip.slots.fromDate
              const fromDate = trip.slots.fromDate ? new Date(trip.slots.fromDate) : new Date();
              fromDate.setHours(0, 0, 0, 0);

              let updatedDate = new Date(date);

              // Check if the date part is today (meaning user likely only selected time)
              if (isSameDay(updatedDate, new Date())) {
                // Use the fromDate as the base date instead of today
                updatedDate = new Date(fromDate);
                // Apply the selected time
                updatedDate.setHours(date.getHours());
                updatedDate.setMinutes(date.getMinutes());
              }

              // Ensure the date isn't before the minimum date
              if (updatedDate < fromDate) {
                updatedDate = new Date(fromDate);
                updatedDate.setHours(date.getHours());
                updatedDate.setMinutes(date.getMinutes());
              }

              setDepartureDate(updatedDate);
              const isPackageBooking=trip.packageBooking;
              // If it's a package booking, automatically set the return date
              
                setReturnDate(null);
              
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            dateFormat="MMM d, yyyy h:mm aa"
            minDate={(() => {
              if (!trip.slots.fromDate) return new Date();
              const fromDate = new Date(trip.slots.fromDate);
              if (isNaN(fromDate.getTime())) return new Date();
              fromDate.setHours(0, 0, 0, 0);
              return fromDate;
            })()}
            filterDate={(date) => {
              if (!trip.slots.fromDate) return false;
              const fromDate = new Date(trip.slots.fromDate);
              if (isNaN(fromDate.getTime())) return false;
              fromDate.setHours(0, 0, 0, 0);
              return date >= fromDate;
            }}
            placeholderText="Departure date & time"
            className="w-full border-b-2 border-gray-300 pl-10 pr-3 py-1.5 text-left text-sm text-gray-500 focus:outline-none focus:border-[#0f7bab]"
            calendarClassName="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md p-2"
          />
        </div>
      </div>

      {/* New End Date */}
      <div className="flex-1">
        <label className="block text-[#01374e] text-sm md:text-base font-medium mb-1">
          New End Date
        </label>
        <div className="relative flex items-center">
          <CalendarIcon
            className="absolute left-3 text-gray-500"
            size={16}
          />
             <DatePicker
      selected={returnDate}
      onChange={(date) => {
        if (!date) return;
        let updatedDate = new Date(date);
        
        const isPackageBooking = trip.packageBooking;
        
        if (isPackageBooking) {
          // Package booking logic remains the same
          const packageDays = trip.packageDetails?.days || 0;
          
          if (departureDate) {
            const minReturnDate = new Date(departureDate);
            const maxReturnDate = new Date(departureDate);
            maxReturnDate.setDate(departureDate.getDate() + packageDays);
            
            if (updatedDate < minReturnDate) {
              updatedDate = new Date(minReturnDate);
              updatedDate.setHours(date.getHours(), date.getMinutes());
            }
            if (updatedDate > maxReturnDate) {
              updatedDate = new Date(maxReturnDate);
              updatedDate.setHours(date.getHours(), date.getMinutes());
            }
          }
        } else {
          // Regular booking logic - modified to allow same day selection
          if (departureDate) {
            // Only enforce that return time is after departure time if same day
            if (isSameDay(departureDate, updatedDate)) {
              if (updatedDate <= departureDate) {
                // If return time is before departure, just keep the selected time but use departure date
                updatedDate = new Date(departureDate);
                updatedDate.setHours(date.getHours(), date.getMinutes());
              }
            }
          }
        }

        setReturnDate(updatedDate);

        // Extra days calculation
        if (departureDate && daysFromAPI?.numberOfDays && !isPackageBooking) {
          const recommendedEnd = new Date(departureDate.getTime());
          recommendedEnd.setDate(departureDate.getDate() + daysFromAPI.numberOfDays);
          
          const timeDifference = date.getTime() - recommendedEnd.getTime();
          
          if (timeDifference > 0) {
            const extraDays = Math.ceil(timeDifference / 86400000);
            setExtraDaysCount(extraDays);
          } else {
            setExtraDaysCount(0);
          }
        }
      }}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={60}
      dateFormat="MMM d, yyyy h:mm aa"
      minDate={departureDate || undefined}
     maxDate={
  trip.packageBooking && departureDate && trip.packageDetails?.days
    ? (() => {
        const maxDate = new Date(departureDate);
        maxDate.setDate(departureDate.getDate() + trip.packageDetails.days);
        return maxDate;
      })()
    : dateLimits?.max ?? undefined
}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      placeholderText="Return date & time"
      className={`w-full border-b-2 border-gray-300 pl-10 pr-3 py-1.5 text-left text-sm text-gray-500 focus:outline-none focus:border-[#0f7bab]`}
      calendarClassName="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md p-2"
      minTime={
        departureDate && isSameDay(departureDate, returnDate || departureDate)
          ? new Date(departureDate.getTime() + 3600000) // 1 minute after departure
          : new Date(new Date().setHours(0, 0, 0, 0))
      }
      maxTime={
        trip.packageBooking && departureDate && returnDate 
          ? (() => {
              const packageDays = trip.packageDetails?.days || 0;
              const lastDay = new Date(departureDate);
              lastDay.setDate(departureDate.getDate() + packageDays);
              
              if (isSameDay(lastDay, returnDate)) {
                return new Date(new Date().setHours(
                  departureDate.getHours(),
                  departureDate.getMinutes(),
                  0, 0
                ));
              }
              return new Date(new Date().setHours(23, 59, 0, 0));
            })()
          : new Date(new Date().setHours(23, 59, 0, 0))
      }
    />
        </div>
      </div>
      <style jsx global>{`
        .react-datepicker {
          border-radius: 0.5rem;
          border-color: #e5e7eb;
          font-size: 14px;
          display:flex;
        }
      `}</style>

      {/* Next Button */}
      <button
        className="text-blue-600 underline text-sm md:text-base font-medium hover:text-blue-800 transition-all self-end md:mb-1"
        onClick={() =>
          handleReschedule(
            trip.bookingId,
            trip.source,
            trip.destination,
            departureDate ? format(departureDate, "yyyy-MM-dd'T'HH:mm:ss") : '', 
            returnDate ? format(returnDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
            trip.packageBooking // Pass package flag
          )
        }
      >
        Next
      </button>
    </div>

    {/* Reschedule Policy Section */}
    {trip.vehicle?.[0]?.policies?.some(p => p.policyDescription === "Reschedule Policy") && (
      <div className="mt-4 border-t border-gray-200 pt-4">
        <h4 className="text-lg font-medium text-blue-900 mb-3">Reschedule Policy</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          {trip.vehicle[0].policies
            .find(policy => policy.policyDescription === "Reschedule Policy")
            ?.policyData?.map((item, index) => (
              <div key={item.id || index} className="flex gap-2 mb-2 last:mb-0">
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">{item.policyMessage}</p>
              </div>
            ))}
        </div>
        
      
      </div>
    )}
  </div>
)}
      </div>
    );
  })
}

      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          isOpen={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
};



const NoTripsMessage = ({ message, icon }: { message: string; icon: JSX.Element }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 md:py-12 md:px-6 bg-white rounded-xl md:rounded-2xl max-w-xs md:max-w-sm mx-auto mt-8">
      <div className="text-[#0f7bab] text-4xl md:text-5xl">{icon}</div>
      <p className="text-gray-600 mt-3 md:mt-4 text-center text-base md:text-lg font-medium">
        {message}
      </p>
      <button
        className="mt-4 md:mt-6 px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-[#0f7bab] to-[#01374e] text-white text-sm md:text-base font-medium rounded-full shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
        onClick={() => router.push("/")}
      >
        Book Now
      </button>
    </div>
  );
};

import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const MediaViewer = ({ 
  media, 
  onClose,
  initialIndex = 0
}: {
  media: Array<{ id: string; mediaUrl: string; type: 'image' | 'video' }>;
  onClose: () => void;
  initialIndex?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  if (!media.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X size={32} />
      </button>

      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center">
        <button 
          onClick={handlePrev}
          className="absolute left-4 text-white hover:text-gray-300 z-10 p-2"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex-1 h-full flex items-center justify-center">
          {media[currentIndex].type === 'image' ? (
            <img 
              src={media[currentIndex].mediaUrl} 
              alt="Review media" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video 
              src={media[currentIndex].mediaUrl} 
              controls
              autoPlay
              className="max-h-full max-w-full"
            />
          )}
        </div>

        <button 
          onClick={handleNext}
          className="absolute right-4 text-white hover:text-gray-300 z-10 p-2"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {media.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
