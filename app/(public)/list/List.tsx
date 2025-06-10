"use client";
import Filter from "@/components/filter/Filter";
import { IoFilterOutline } from "react-icons/io5";
import { Building2, PlayIcon, Star, StarIcon, Users2, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useSearchParams } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { fetchListVehiclesData, selectListVehicles } from "@/app/Redux/list";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import {
  checkVehicleAvailability,
  confirmReschedule,
  distanceCalculation,
  useRescheduleBooking,
} from "@/app/services/data.service";
import Swal from "sweetalert2";
import { setSelectedBus } from "@/app/Redux/busSlice";
import { updateSelectedBuses } from "@/app/Redux/multipleSlice";
import { Bus, PriceBreakDown } from "@/app/types/list.response";
import LoginModal from "@/components/login-modal/loginmodal";
import { selectAuth } from "@/app/Redux/authSlice";
import { AppDispatch } from "@/app/Redux/store";

import { DocumentTextIcon } from '@heroicons/react/24/outline';


const FilterComponent = dynamic(
  () => import("../mobilefilter/FilterComponent"),
  {
    ssr: false,
  }
);

import { FiCalendar, FiEdit2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import toast from "react-hot-toast";
import { setSearchDetails } from "@/app/Redux/searchSlice";
import { FaBus } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { distanceResponse } from "@/app/types/distancecalculationresponse";
import { useDistance } from "@/app/context/DistanceContext";

import {
  addDays,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  set,
  subDays,
} from "date-fns";
import { useLoader } from "@/app/context/LoaderContext";
import ClockTimePicker from "../home/ClockTimePicker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  holdBusAvailability,
  releaseAvailability,
} from "@/app/services/bus.service";
import WarningModal from "@/components/warning/WarningModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnyARecord } from "dns";
type LocationFilterProps = {
  setLoading: (value: boolean) => void;
  searchParamsState: any;
  setSearchParamsState: React.Dispatch<React.SetStateAction<any>>;
};
interface distanceCalculationPayload {
  source: string;
  sourceLatitude: number;
  sourceLongitude: number;
  destination: string;
  destinationLatitude: number;
  destinationLongitude: number;
}
const LocationFilter = ({ setLoading, searchParamsState, 
  setSearchParamsState  }: LocationFilterProps) => {
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [libraries] = useState<"places"[]>(["places"]);
  const searchParams = useSearchParams();
  const isAdjustTrip = searchParams.get("adjustTrip") === "true";

  const from = searchParams.get("source");
  const to = searchParams.get("destination");

  const [openPicker, setOpenPicker] = useState<null | 'start' | 'end'>(null);
  const end = searchParams.get("toDate");
  const getInitialValue = (key: string, fallback: string = "") => {
    const fromParams = searchParams.get(key);
    if (fromParams) return fromParams;
    
    const bookingData = sessionStorage.getItem("booking_form__data");
    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      return parsed[key] || fallback;
    }
    return fallback;
  };

  const [fromLocation, setFromLocation] = useState<string>(() => {
    return getInitialValue("source", "");
  });

  const [toLocation, setToLocation] = useState<string>(() => {
    return getInitialValue("destination", "");
  });


  const [startDate, setStartDate] = useState<Date | null>(() => {
   
      const bookingData = sessionStorage.getItem("booking_form__data");
      if (bookingData) {
        const parsed = JSON.parse(bookingData);
        if (parsed?.fromDate) {
          const date = new Date(parsed.fromDate);
          return isNaN(date.getTime()) ? null : new Date(date.toISOString());
        }
      }
    
    return null;
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    
      const bookingData = sessionStorage.getItem("booking_form__data");

      if (bookingData) {
        const parsed = JSON.parse(bookingData);
        if (parsed?.toDate) {
          const date = new Date(parsed.toDate);
          return isNaN(date.getTime()) ? null : new Date(date.toISOString());
        
      }
    }

    return null;
  });

  const [sourceCoords, setSourceCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [destinationCoords, setDestinationCoords] = useState({
    latitude: 0,
    longitude: 0,
  });

  // Time picker states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);
  const fromLocationRef = useRef<HTMLInputElement>(null);
  const toLocationRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<DatePicker | null>(null);
  const startDateRef = useRef<DatePicker | null>(null);
  const endDateRef = useRef<DatePicker | null>(null);

  const { daysFromAPI, callDistanceAPI, extraDaysCount, setExtraDaysCount } =
    useDistance();
  const isFormValid = fromLocation && toLocation && startDate && endDate;

  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);

  const onOriginLoad = (autocomplete: google.maps.places.Autocomplete) => {
    originRef.current = autocomplete;
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    destinationRef.current = autocomplete;
  };

  const onOriginPlaceChanged = async () => {
    if (originRef.current) {
      const place = originRef.current.getPlace();
      if (place.formatted_address) {
        setFromLocation(place.formatted_address);
        
        // Update booking form data immediately
        updateBookingFormData({
          source: place.formatted_address,
          fromDate: null,
          toDate: null
        });

        setStartDate(null);
        setEndDate(null);

        const sourceLocation = await fetchCoordinates(
          place.formatted_address,
          "source"
        );
        
        if (sourceLocation) {
          // Update coordinates in booking form data
          updateBookingFormData({
            sourceLatitude: sourceLocation.latitude,
            sourceLongitude: sourceLocation.longitude
          });

          if (destinationCoords.latitude) {
            callDistanceAPI(
              place.formatted_address,
              toLocation,
              sourceLocation,
              destinationCoords
            );
          }
        }
      }
    }
  };


  const onDestinationPlaceChanged = async () => {
    if (destinationRef.current) {
      const place = destinationRef.current.getPlace();
      if (place.formatted_address) {
        setToLocation(place.formatted_address);
        
        // Update booking form data immediately
        updateBookingFormData({
          destination: place.formatted_address,
          fromDate: null,
          toDate: null
        });

        setStartDate(null);
        setEndDate(null);

        const destLocation = await fetchCoordinates(
          place.formatted_address,
          "destination"
        );
        
        if (destLocation) {
          // Update coordinates in booking form data
          updateBookingFormData({
            destinationLatitude: destLocation.latitude,
            destinationLongitude: destLocation.longitude
          });

          if (sourceCoords.latitude) {
            callDistanceAPI(
              fromLocation,
              place.formatted_address,
              sourceCoords,
              destLocation
            );

            if (startDate && daysFromAPI?.numberOfDays) {
              const newEndDate = new Date(startDate);
              newEndDate.setDate(newEndDate.getDate() + daysFromAPI.numberOfDays);
              setEndDate(newEndDate);
              
              // Update end date in booking form data
              updateBookingFormData({
                toDate: newEndDate.toISOString()
              });
            }
          }
        }
      }
    }
  };

  const fetchCoordinates = async (
    address: string,
    type: "source" | "destination"
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const coords = { latitude: location.lat, longitude: location.lng };
        if (type === "source") {
          setSourceCoords(coords);
        } else {
          setDestinationCoords(coords);
        }
        return coords;
      } else {
        toast.error("Unable to fetch coordinates for the location.");
        return null;
      }
    } catch (error) {
      toast.error("Error fetching coordinates.");
      return null;
    }
  };

  const handleEditClick = (
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handledateEditClick = (
    inputRef: React.RefObject<DatePicker | null>
  ) => {
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.setOpen(true);
    }
  };

  const toggleModify = () => setIsModifyOpen(!isModifyOpen);
  const adjustTrip = searchParams.get("adjustTrip");


  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start) {
      sessionStorage.setItem("startDate", start.toISOString());
    }
    if (end) {
      sessionStorage.setItem("endDate", end.toISOString());
    }
  };
  const [isStartDateComplete, setIsStartDateComplete] = useState(false);

  const handleStartTimeChange = (date: Date) => {
    setStartDate(date);
    sessionStorage.setItem("startDate", date.toISOString());
    setShowStartTimePicker(false);
    setIsStartDateComplete(true); // Mark start date as complete
  };
  const handleEndTimeChange = (date: Date) => {
    setEndDate(date);
    sessionStorage.setItem("endDate", date.toISOString());
    setShowEndTimePicker(false);
  };
  const getDateRange = (start: Date, duration: number) => {
    const recommendedEnd = addDays(start, duration); // Start + duration
    const min = addDays(start, Math.max(duration - 1, 0)); // For 1-day trips, use same day

    return {
      recommendedEnd,
      min,
      max: null, // No upper limit
    };
  };
  const getLastTwoDaysRange = (start: Date, duration: number) => {
    const recommendedEnd = addDays(start, duration); // Recommended end date
    const extraDayEnd = addDays(recommendedEnd, 1); // One extra day beyond recommended

    const from = subDays(recommendedEnd, 1); // Second last day of recommended duration

    return {
      min: set(from, { hours: 0, minutes: 0 }), // Start of second-last day
      max: set(extraDayEnd, { hours: 23, minutes: 59 }), // End of extra day
      recommendedEnd, // Keep track of the original recommended end date
      extraDayEnd, // Track the extra day boundary
    };
  };

  const dateLimits = startDate
    ? getLastTwoDaysRange(startDate, daysFromAPI?.numberOfDays ?? 0)
    : null;
  useEffect(() => {
    if (fromLocation && toLocation) {
      fetchCoordinates(fromLocation, "source");
      fetchCoordinates(toLocation, "destination");
    }
  }, []);
  useEffect(() => {
    if (showStartTimePicker || showEndTimePicker) {
      document.body.classList.add('react-datepicker__body--open');
    } else {
      document.body.classList.remove('react-datepicker__body--open');
    }
  
    return () => {
      document.body.classList.remove('react-datepicker__body--open');
    };
  }, [showStartTimePicker, showEndTimePicker]);
  // Add this to handle mobile viewport height changes
const [vh, setVh] = useState('100vh');

useEffect(() => {
  const handleResize = () => {
    setVh(`${window.innerHeight * 0.01}px`);
  };
  
  window.addEventListener('resize', handleResize);
  handleResize();
  
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Then use in style:
const updateBookingFormData = (updates: Record<string, any>) => {
  const bookingData = sessionStorage.getItem("booking_form__data");
  const currentData = bookingData ? JSON.parse(bookingData) : {};
  
  const updatedData = {
    ...currentData,
    ...updates
  };
  
  sessionStorage.setItem("booking_form__data", JSON.stringify(updatedData));
  return updatedData;
};
  const bookingId = searchParams.get("bookingId") || "";
  const isReschedule = searchParams.get("adjustTrip") === "true";
  const handleSearch = async () => {
    if (!fromLocation || !toLocation || !startDate || !endDate) {
      toast.error("Please fill in all fields before proceeding");
      return;
    }

    // Format dates with Indian timezone
    const formatForStorage = (date: Date) => {
      return date
        .toLocaleString("sv-SE", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        })
        .replace(" ", "T");
    };

    const localStartDate = formatForStorage(startDate);
    const localEndDate = formatForStorage(endDate);

    // Update all data in booking form
   
    // Create new search params
    const newSearchParams = {
      source: fromLocation,
      destination: toLocation,
      fromDate: localStartDate,
      toDate: localEndDate,
      sourceLatitude: sourceCoords.latitude,
      sourceLongitude: sourceCoords.longitude,
      destinationLatitude: destinationCoords.latitude,
      destinationLongitude: destinationCoords.longitude,
      tripExtraDays: extraDaysCount,
      distanceInKm: daysFromAPI?.kiloMeter ?? 0,
      ...(isReschedule && {
        isReschedule: true,
        bookingId: bookingId,
      }),
    };

    // Update the state and session storage
    setSearchParamsState(newSearchParams);
    sessionStorage.setItem("booking_form__data", JSON.stringify(newSearchParams));
    // Also save dates separately for easier access
    sessionStorage.setItem("startDate", localStartDate);
    sessionStorage.setItem("endDate", localEndDate);
    sessionStorage.setItem("fromDate", localStartDate);
    sessionStorage.setItem("toDate", localEndDate);

    setLoading(true);

    try {
      await dispatch(
        setSearchDetails({
          source: fromLocation,
          destination: toLocation,
          fromDate: localStartDate,
          toDate: localEndDate,
        })
      );

     
     

      toggleModify();
    } catch (error) {
      toast.error("Something went wrong while searching!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU"
      libraries={libraries}
      region="IN"
    >
      <div className="bg-[#01374e] py-3 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between w-full max-w-8xl mx-auto mt-1.5 mb-3 lg:mb-0 px-4 md:px-6 lg:px-7 gap-3 md:gap-4 relative">
     {/* From Location */}
<div
  className={`relative flex items-center font-semibold rounded-md px-3 py-2 w-full md:w-1/5 flex-grow border transition-all duration-300 ${
    isEditing && !adjustTrip
        ? "border-2 border-[#0f7bab] bg-[#fff] shadow-lg"
              : "border border-gray-300 bg-white"
  }`}
>
  <FaBus className="text-sm text-[#01374e] flex-shrink-0 mr-2" />
  <div className="flex-1 min-w-0">
    {isEditing && !adjustTrip ? (
      <Autocomplete
        onLoad={onOriginLoad}
        onPlaceChanged={onOriginPlaceChanged}
      >
        <input
          type="text"
          ref={fromLocationRef}
          value={fromLocation}
          onChange={(e) => {
            setFromLocation(e.target.value);
            setStartDate(null);
            setEndDate(null);
          }}
      className="text-[#01374e] text-xs font-semibold outline-none w-full bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
          placeholder="From"
        />
      </Autocomplete>
    ) : (
       <span className="text-[#01374e] text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap block">
        {fromLocation || "From"}
      </span>
    )}
  </div>
  {isEditing && !adjustTrip && (
    <FiEdit2
      onClick={() => handleEditClick(fromLocationRef)}
      className="absolute right-3 text-[#0f7bab] cursor-pointer"
    />
  )}
</div>

{/* To Location */}
<div
  className={`relative flex items-center font-semibold rounded-md px-3 py-2 w-full md:w-1/5 flex-grow border transition-all duration-300 ${
    isEditing && !adjustTrip
        ? "border-2 border-[#0f7bab] bg-[#fff] shadow-lg"
              : "border border-gray-300 bg-white"
  }`}
>
  <FaLocationDot className="text-sm text-[#01374e] flex-shrink-0 mr-2" />
  <div className="flex-1 min-w-0">
    {isEditing && !adjustTrip ? (
      <Autocomplete
        onLoad={onDestinationLoad}
        onPlaceChanged={onDestinationPlaceChanged}
      >
        <input
          type="text"
          ref={toLocationRef}
          value={toLocation}
          onChange={(e) => {
            setToLocation(e.target.value);
            setStartDate(null);
            setEndDate(null);
          }}
        className="text-[#01374e] text-xs font-semibold outline-none w-full bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
          placeholder="To"
        />
      </Autocomplete>
    ) : (
      <span className="text-[#01374e] text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap block">
      {toLocation || "To"}
    </span>
    )}
  </div>
  {isEditing && !adjustTrip && (
    <FiEdit2
      onClick={() => handleEditClick(toLocationRef)}
      className="absolute right-3 text-[#0f7bab] cursor-pointer"
    />
  )}
</div>
       


{/* Start Date Picker */}
<div
          className={`relative flex items-center rounded-md px-3 py-2 w-full md:w-1/5 flex-grow border transition-all duration-300 ${
            isEditing ? "bg-[#fff] shadow-l" : "bg-white"
          }`}
        >
          <FiCalendar className="text-[#01374e] text-sm mr-2" />
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              if (!date) return;
              const tomorrow = addDays(new Date(), 1);
              if (isToday(date)) {
                date.setFullYear(tomorrow.getFullYear());
                date.setMonth(tomorrow.getMonth());
                date.setDate(tomorrow.getDate());
              }
              setStartDate(date);
              setEndDate(null);
              setExtraDaysCount(0);
              setShowStartTimePicker(true);
              setIsStartDateComplete(false); // Reset until time is selected
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={addDays(new Date(), 1)}
            timeIntervals={60}
            dateFormat="d MMM yyyy h:mm aa"
            className="text-[#01374e] text-xs font-semibold focus:outline-none w-full cursor-pointer bg-transparent"
            placeholderText="Start Date & Time"
            disabled={!isEditing}
            ref={startDateRef}
            onClickOutside={() => setShowStartTimePicker(false)}
          />
          {isEditing && (
            <FiEdit2
              onClick={() => handledateEditClick(startDateRef)}
              className="absolute right-3 text-[#0f7bab] cursor-pointer"
            />
          )}
        </div>

        {/* End Date Picker */}
        <div
           className={`relative flex items-center rounded-md px-3 py-2 w-full md:w-auto flex-grow border transition-all duration-300 ${
            isEditing 
              ? isStartDateComplete 
                ? "bg-[#fff] shadow-l" 
                : "bg-gray-300 cursor-not-allowed"
              : "bg-white"
          }`}
        >
          <FiCalendar className="text-[#01374e] text-sm mr-2" />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
              if (!date) return;
              let updatedDate = date;

              if (dateLimits) {
                const isSelectingAllowedDate =
                  isAfter(date, dateLimits.min) ||
                  isSameDay(date, dateLimits.min) ||
                  isBefore(date, dateLimits.max) ||
                  isSameDay(date, dateLimits.max);

                if (
                  isSelectingAllowedDate &&
                  (!endDate || !isSameDay(date, endDate))
                ) {
                  updatedDate = date;
                } else if (endDate && isSameDay(date, endDate)) {
                  updatedDate = new Date(endDate);
                  updatedDate.setHours(date.getHours());
                  updatedDate.setMinutes(date.getMinutes());
                }
              }

              if (startDate && isSameDay(startDate, updatedDate)) {
                updatedDate = set(updatedDate, { hours: 22, minutes: 0 });
              }

              setEndDate(updatedDate);
              setShowEndTimePicker(true);

              // ✅ Extra Days Calculation
              if (startDate && daysFromAPI?.numberOfDays) {
                const recommendedEnd = new Date(startDate.getTime());
                recommendedEnd.setDate(startDate.getDate() + daysFromAPI.numberOfDays);
                
                // Calculate time difference in milliseconds
                const timeDifference = date.getTime() - recommendedEnd.getTime();
                
                // If selected end is after recommended end, calculate extra days
                if (timeDifference > 0) {
                  // Convert milliseconds to days (1 day = 86400000 milliseconds)
                  // Use Math.ceil to round up partial days
                  const extraDays = Math.ceil(timeDifference / 86400000);
                  setExtraDaysCount(extraDays);
                } else {
                  setExtraDaysCount(0);
                }
              }
              
              
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={dateLimits?.min}
            maxDate={dateLimits?.max}
            showMonthDropdown
            showYearDropdown
            timeIntervals={60}
            timeCaption="Time"
            dateFormat="d MMM yyyy h:mm aa"
            className={`text-[#01374e] text-xs font-semibold focus:outline-none w-full ${
              isEditing && isStartDateComplete ? "cursor-pointer" : "cursor-not-allowed"
            } bg-transparent`}
            placeholderText="End Date & Time"
            minTime={
              endDate && dateLimits && isSameDay(endDate, dateLimits.min)
                ? dateLimits.min
                : set(new Date(), { hours: 0, minutes: 0 })
            }
            maxTime={
              endDate && dateLimits && isSameDay(endDate, dateLimits.max)
                ? dateLimits.max
                : set(new Date(), { hours: 23, minutes: 59 })
            }
            disabled={!isStartDateComplete || !isEditing}
            ref={endDateRef}
            onClickOutside={() => setShowEndTimePicker(false)}
          />
          {isEditing && (
            <FiEdit2
              onClick={() => handledateEditClick(endDateRef)}
              className="absolute right-3 text-[#0f7bab] cursor-pointer"
            />
          )}
        </div>

        {/* Time Pickers */}
        {showStartTimePicker && startDate && (
          <div ref={startTimeRef}>
            <ClockTimePicker
              selectedTime={startDate}
              onChange={handleStartTimeChange}
              onClose={() => setShowStartTimePicker(false)}
              startDate={null}
              isPackage={false}
              isEndDatePicker={false}
              style={{ position: "absolute", top: "15vh", right: "35vw" }}
            />
          </div>
        )}

        {showEndTimePicker && endDate && (
          <div ref={endTimeRef}>
            <ClockTimePicker
              selectedTime={endDate}
              onChange={handleEndTimeChange}
              onClose={() => setShowEndTimePicker(false)}
              startDate={startDate}
              isPackage={false}
              numberOfDays={daysFromAPI?.numberOfDays}
              isEndDatePicker={true}
              style={
                typeof window !== "undefined" && window.innerWidth < 620
                  ? { position: "absolute", left: "3vw", top: "30%" }
                  : { position: "absolute", top: "15vh", right: "15vw" }
              }
            />
          </div>
        )}

        {/* Modify / Search Button */}
        <button
          onClick={() => {
            setIsEditing((prev) => {
              const newState = !prev;
              if (!newState) {
                // Only handle search if the form is valid
                if (isFormValid) {
                  handleSearch();
                } else {
                  toast.error("Please fill in all fields before proceeding");
                }
              }
              return newState;
            });
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            isEditing
              ? `bg-[#0f7bab] text-white shadow-lg scale-105 ${
                  !isFormValid
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer"
                }`
              : "bg-white text-[#0f7bab] font-bold border border-[#0f7bab] cursor-pointer"
          }`}
          disabled={isEditing && !isFormValid}
        >
          {isEditing ? "Search" : "Modify"}
        </button>



        {/* Global Styles */}
        <style jsx global>{`
          .react-datepicker {
            border-radius: 0.5rem;
            border-color: #e5e7eb;
            font-size: 14px;
            display: flex;
          }
          .react-datepicker-popper {
            position: absolute;
            left: 0px;
            top: 0px;
          }
          .react-datepicker__header {
            background-color: white;
            border-bottom: 1px solid #e5e7eb;
          }
          .react-datepicker__month-container {
            padding: 0.5rem;
          }
          .react-datepicker__month-container
            + .react-datepicker__month-container {
            margin-left: 1rem;
          }
          .react-datepicker__day--selected:not(
              .react-datepicker__day--outside-month
            ) {
            background-color: #0f7bab !important;
            color: white !important;
            margin: 0;
            border-radius: 50%;
          }
          .react-datepicker__time-container
            .react-datepicker__time
            .react-datepicker__time-box
            ul.react-datepicker__time-list
            li.react-datepicker__time-list-item--disabled {
            color: #ccc !important;
            cursor: not-allowed !important;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--range-start,
          .react-datepicker__day--range-end {
            color: white !important;
            margin: 0;
          }
          .react-datepicker__day--in-range {
            background-color: rgba(59, 130, 246, 0.2) !important;
            color: black !important;
            border-radius: 0 !important;
            margin: 0;
          }
          .react-datepicker__day-name,
          .react-datepicker__day,
          .react-datepicker__time-name {
            width: 2rem !important;
            line-height: 2rem !important;
            margin: 0 !important;
          }
          .react-datepicker__day--selected:not([aria-disabled="true"]):hover,
          .react-datepicker__day--in-selecting-range:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__day--in-range:not([aria-disabled="true"]):hover,
          .react-datepicker__month-text--selected:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__month-text--in-selecting-range:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__month-text--in-range:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__quarter-text--selected:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__quarter-text--in-selecting-range:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__quarter-text--in-range:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__year-text--selected:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__year-text--in-selecting-range:not(
              [aria-disabled="true"]
            ):hover,
          .react-datepicker__year-text--in-range:not(
              [aria-disabled="true"]
            ):hover {
            border-radius: 0 !important;
            color: #fff !important;
            background-color: #0f7bab !important;
          }
          .react-datepicker__day--in-selecting-range:not(
              .react-datepicker__day--in-range,
              .react-datepicker__month-text--in-range,
              .react-datepicker__quarter-text--in-range,
              .react-datepicker__year-text--in-range
            ),
          .react-datepicker__month-text--in-selecting-range:not(
              .react-datepicker__day--in-range,
              .react-datepicker__month-text--in-range,
              .react-datepicker__quarter-text--in-range,
              .react-datepicker__year-text--in-range
            ),
          .react-datepicker__quarter-text--in-selecting-range:not(
              .react-datepicker__day--in-range,
              .react-datepicker__month-text--in-range,
              .react-datepicker__quarter-text--in-range,
              .react-datepicker__year-text--in-range
            ),
          .react-datepicker__year-text--in-selecting-range:not(
              .react-datepicker__day--in-range,
              .react-datepicker__month-text--in-range,
              .react-datepicker__quarter-text--in-range,
              .react-datepicker__year-text--in-range
            ) {
            background-color: rgba(59, 130, 246, 0.2);
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--in-selecting-range,
          .react-datepicker__day--in-range,
          .react-datepicker__month-text--selected,
          .react-datepicker__month-text--in-selecting-range,
          .react-datepicker__month-text--in-range,
          .react-datepicker__quarter-text--selected,
          .react-datepicker__quarter-text--in-selecting-range,
          .react-datepicker__quarter-text--in-range,
          .react-datepicker__year-text--selected,
          .react-datepicker__year-text--in-selecting-range,
          .react-datepicker__year-text--in-range {
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.2);
            color: #000;
          }
          .react-datepicker__day--range-end.react-datepicker__day--in-range {
            background-color: #0f7bab !important;
            color: white !important;
            margin: 0;
            border-radius: 50%;
          }
          .react-datepicker__navigation--next {
            color: black !important;
          }
          .react-datepicker__current-month {
            font-weight: 500;
            color: #111827;
          }
          .react-datepicker__day-name {
            color: #6b7280;
            font-weight: 500;
          }
          .react-datepicker__input-container input {
            font-size: 12px;
          }
          .react-datepicker__input-container input::placeholder {
            font-size: 12px;
          }
          @media only screen and (max-width: 580px) {
            .react-datepicker-popper {
              transform: translateX(20px) !important;
            }
          }
        `}</style>
      </div>
    </LoadScript>
  );
};
const MediaModal = ({ media, onClose }: { media: { url: string; type: 'image' | 'video' } | null; onClose: () => void }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
        >
          <XIcon className="w-8 h-8" />
        </button>
        
        <div className="bg-black rounded-lg overflow-hidden">
          {media.type === 'image' ? (
            <img 
              src={media.url} 
              alt="Enlarged review media" 
              className="w-full h-full object-contain max-h-[80vh] mx-auto"
            />
          ) : (
            <video 
              controls 
              autoPlay 
              className="w-full max-h-[80vh] mx-auto"
            >
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};
const List = () => {
  const searchParams = useSearchParams();
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBuses, setSelectedBuses] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [bs, setBs] = useState<Bus[] | null>();
  const multipleBookingParam = searchParams.get("isMultipleBooking");
  const multipleBooking = multipleBookingParam === "true" ? "true" : "false";

  const isMultipleBooking = searchParams.get("isMultipleBooking") === "true";
  const [searchParamsState, setSearchParamsState] = useState(() => {
    const bookingData = sessionStorage.getItem("booking_form__data");
    return bookingData ? JSON.parse(bookingData) : {};
  });
const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  const actualData = useMemo(() => {
    const data = sessionStorage.getItem("booking_form__data");
    return data ? JSON.parse(data) : {};
  }, []);
  const queryClient = useQueryClient();
  
  // Extract all the actualData dependencies
  const queryParams = {
    source: actualData.source,
    destination: actualData.destination,
    fromDate: actualData.fromDate,
    toDate: actualData.toDate,
    distanceInKm: actualData.distanceInKm,
    sourceLatitude: actualData.sourceLatitude,
    sourceLongitude: actualData.sourceLongitude,
    destinationLatitude: actualData.destinationLatitude,
    destinationLongitude: actualData.destinationLongitude,
    tripExtraDays: actualData.tripExtraDays ?? 0,
    isReschedule: actualData.isReschedule,
    bookingId: actualData.bookingId
  };
  const { data: buses, isLoading, isFetching, isError } = useQuery({
    queryKey: ['buses', searchParamsState],
    queryFn: async () => {
      showLoader();
      try {
        const stored = sessionStorage.getItem("vehicleHoldKeys");
        if (stored) {
          const holdKeys = JSON.parse(stored);
          if (holdKeys.length > 0) {
            const commaSeparated = holdKeys.join(",");
            await releaseAvailability(commaSeparated);
            sessionStorage.removeItem("vehicleHoldKeys");
          }
        }
  
        if (
          !searchParamsState.source ||
          !searchParamsState.destination ||
          !searchParamsState.fromDate ||
          !searchParamsState.toDate ||
          searchParamsState.sourceLatitude == null ||
          searchParamsState.sourceLongitude == null ||
          searchParamsState.destinationLatitude == null ||
          searchParamsState.destinationLongitude == null
        ) {
          console.warn("Missing required fields, skipping availability check");
          return [];
        }
  
        // Force isReschedule to false if isMultiReschedule is true
        const isReschedule = searchParamsState.isMultiReschedule ? false : searchParamsState.isReschedule;
  
        const res = await checkVehicleAvailability(
          searchParamsState.source,
          searchParamsState.destination,
          searchParamsState.fromDate,
          searchParamsState.toDate,
          searchParamsState.distanceInKm,
          searchParamsState.sourceLatitude,
          searchParamsState.sourceLongitude,
          searchParamsState.destinationLatitude,
          searchParamsState.destinationLongitude,
          searchParamsState.tripExtraDays,
          isReschedule, // Now explicitly set based on isMultiReschedule
          searchParamsState.isMultiReschedule,
          searchParamsState.bookingId
        );
  
        return Array.isArray(res) ? res : res ? [res] : [];
      } finally {
        hideLoader();
      }
    },
    enabled: !!(
      searchParamsState.source &&
      searchParamsState.destination &&
      searchParamsState.fromDate &&
      searchParamsState.toDate &&
      searchParamsState.sourceLatitude != null &&
      searchParamsState.sourceLongitude != null &&
      searchParamsState.destinationLatitude != null &&
      searchParamsState.destinationLongitude != null
    ),
    staleTime: 0,
    gcTime: 0,
    retry: false, 
    refetchOnWindowFocus: false,
  });
  

  // Properly calculate the loading state
  const showLoading = isLoading || isFetching;
  

  
  const isAnyFilterSelected = Object.values(selectedFilters).some(
    (filter) => filter.length > 0
  );
  // Update the filtered buses logic
  const filteredBuses = useMemo(() => {
    if (!buses) return [];
    
    return isAnyFilterSelected
      ? buses.filter((bus) => {
          const acFilter = selectedFilters["AC/Non-AC"]?.length
            ? selectedFilters["AC/Non-AC"].includes(bus.vehicleAC)
            : true;

          const sleeperFilter = selectedFilters["Seater Type"]?.length
            ? selectedFilters["Seater Type"].includes(bus.sleeper ?? "")
            : true;

          const seaterFilter = selectedFilters["Seat Capacity"]?.length
            ? selectedFilters["Seat Capacity"].includes(
                String(bus.seatCapacity ?? "")
              )
            : true;

          return acFilter && sleeperFilter && seaterFilter;
        })
      : buses;
  }, [buses, selectedFilters, isAnyFilterSelected]);

  
  //   let isMounted = true;
    
  //   const checkVehicleHoldKey = async () => {
  //     setLoading(true);
  
  //     try {
  //       // 1. First release any held vehicles
  //       const stored = sessionStorage.getItem("vehicleHoldKeys");
  //       if (stored) {
  //         const holdKeys: string[] = JSON.parse(stored);
  //         if (holdKeys.length > 0) {
  //           const commaSeparated = holdKeys.join(",");
  //           await releaseAvailability(commaSeparated);
  //           sessionStorage.removeItem("vehicleHoldKeys");
  //         }
  //       }
  
  //       // 2. Ensure all important fields exist
  //       if (
  //         !actualData.source ||
  //         !actualData.destination ||
  //         !actualData.fromDate ||
  //         !actualData.toDate ||
  //         actualData.sourceLatitude == null ||
  //         actualData.sourceLongitude == null ||
  //         actualData.destinationLatitude == null ||
  //         actualData.destinationLongitude == null
  //       ) {
  //         console.warn("Missing required actualData fields, skipping availability check");
  //         return;
  //       }
  
  //       // 3. Fetch vehicle availability
  //       const res = await checkVehicleAvailability(
  //         actualData.source,
  //         actualData.destination,
  //         actualData.fromDate,
  //         actualData.toDate,
  //         actualData.distanceInKm,
  //         actualData.sourceLatitude,
  //         actualData.sourceLongitude,
  //         actualData.destinationLatitude,
  //         actualData.destinationLongitude,
  //         actualData.tripExtraDays ?? 0, // default fallback
  //         actualData.isReschedule,
  //         actualData.bookingId
  //       );
  
  //       if (isMounted && res) {
  //         setBs(Array.isArray(res) ? res : [res]);
  //       }
  //     } catch (error) {
  //       console.error("Error in vehicle availability check:", error);
  //       if (isMounted) {
  //         setBs([]);
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false);
  //       }
  //     }
  //   };
  
  //   // ✅ Only trigger if important data is ready
  //   if (
  //     actualData.source &&
  //     actualData.destination &&
  //     actualData.fromDate &&
  //     actualData.toDate &&
  //     actualData.sourceLatitude != null &&
  //     actualData.sourceLongitude != null &&
  //     actualData.destinationLatitude != null &&
  //     actualData.destinationLongitude != null
  //   ) {
  //     checkVehicleHoldKey();
  //   }
  
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [
  //   actualData.source,
  //   actualData.destination,
  //   actualData.fromDate,
  //   actualData.toDate,
  //   actualData.sourceLatitude,
  //   actualData.sourceLongitude,
  //   actualData.destinationLatitude,
  //   actualData.destinationLongitude,
  //   actualData.distanceInKm,
  //   actualData.tripExtraDays,
  //   actualData.isReschedule,
  //   actualData.bookingId
  // ]);
  

  const removeFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [category]: prev[category]?.filter((item) => item !== value) || [],
      };

      if (updatedFilters[category].length === 0) {
        delete updatedFilters[category];
      }

      return updatedFilters;
    });
  };
  // In your List component
  useEffect(() => {
    // Load selected buses from sessionStorage on component mount
    const savedSelectedBuses = sessionStorage.getItem("selectedBuses");
    if (savedSelectedBuses) {
      setSelectedBuses(JSON.parse(savedSelectedBuses));
    }
  }, []);

  const toggleBusSelection = (busId: string) => {
    setSelectedBuses((prevSelected) => {
      const newSelected = prevSelected.includes(busId)
        ? prevSelected.filter((id) => id !== busId)
        : [...prevSelected, busId];

      // Save to sessionStorage whenever selection changes
      sessionStorage.setItem("selectedBuses", JSON.stringify(newSelected));
      return newSelected;
    });
  };
  const [selectedActions, setSelectedActions] = useState<
    Record<string, string | null>
  >({});

  const actionContent: Record<string, string> = {
    Policies: "These are the policies",
    Reviews: "These are the reviews",
  };

  const toggleAction = (busId: string, action: string) => {
    setSelectedActions((prev) => ({
      ...prev,
      [busId]: prev[busId] === action ? null : action,
    }));
  };

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data:  error } = useSelector(selectListVehicles);

  const router = useRouter();
  // useEffect(() => {
  //   console.log("👉 Selected Seat Capacity Filters:", selectedFilters["Seat Capacity"]);

  //   const seatFiltered = buses.filter((bus) =>
  //     selectedFilters["Seat Capacity"]?.includes(String(bus.seatCapacity))
  //   );

  //   console.log("🚌 Filtered Buses based on seat capacity:", seatFiltered);
  // }, [selectedFilters, buses]);



  
  // const filteredBuses = isAnyFilterSelected
  //   ? bs!.filter((bus) => {
  //       const acFilter = selectedFilters["AC/Non-AC"]?.length
  //         ? selectedFilters["AC/Non-AC"].includes(bus.vehicleAC)
  //         : true;

  //       const sleeperFilter = selectedFilters["Seater Type"]?.length
  //         ? selectedFilters["Seater Type"].includes(bus.sleeper ?? "")
  //         : true;

  //       const seaterFilter = selectedFilters["Seat Capacity"]?.length
  //         ? selectedFilters["Seat Capacity"].includes(
  //             String(bus.seatCapacity ?? "")
  //           )
  //         : true;

  //       return acFilter && sleeperFilter && seaterFilter; // ← You missed this
  //     })
  //   : bs;

  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const bookingData = sessionStorage.getItem("booking_form__data");
    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      if (parsed?.fromDate) {
        const date = new Date(parsed.fromDate);
        return isNaN(date.getTime()) ? null : new Date(date.toISOString());
      }
    }
    return null;
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    const bookingData = sessionStorage.getItem("booking_form__data");
    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      if (parsed?.toDate) {
        const date = new Date(parsed.toDate);
        return isNaN(date.getTime()) ? null : new Date(date.toISOString());
      }
    }
    return null;
  });

  const handleBusSelect = async (bus: Bus) => {
    try {
      showLoader();

      dispatch(setSelectedBus(bus));

      if (!authData.isAuthenticated) {
        sessionStorage.setItem("pendingBus", JSON.stringify(bus));
        setIsLoginModalOpen(true);
        return;
      }

      let actFrom;
      let actTo;
      if (startDate) {
        const frDate = new Date(startDate);
        actFrom = frDate.toISOString().split("T")[0];
      }
      if (endDate) {
        const toDate = new Date(endDate);
        actTo = toDate.toISOString().split("T")[0];
      }

      const selectedBus = bus.vehicleNumber;

      if (!actFrom || !actTo) {
        throw new Error("Start date and end date are required");
      }
      const res = await holdBusAvailability(actFrom, actTo, [selectedBus]);
      if (res) {
        if (
          Array.isArray(res) &&
          res.map((val) => val.statusCode === 409).includes(true)
        ) {
          setWarningModalOpen(true);
          return;
        }
        const holdKeys = Array.isArray(res)
          ? res.map((item) => item.vehicleHoldKey)
          : [];
        sessionStorage.setItem("vehicleHoldKeys", JSON.stringify(holdKeys));
      }

      await router.push(
        `/payments?vehicleNumber=${
          bus.vehicleNumber
        }&isMultipleBooking=${multipleBooking}&selectedBus=${encodeURIComponent(
          JSON.stringify(bus)
        )}`
      );
    } catch (error) {
    } finally {
      hideLoader(); // Always hide loader after process
    }
  };
  const handleMultipleBusSelect = async (buses: Bus[]) => {
    dispatch(updateSelectedBuses(buses));

    const vehicleNumbers = buses.map((bus) => bus.vehicleNumber).join(",");

    if (!authData.isAuthenticated) {
      setIsLoginModalOpen(true);
      const selected_bus = JSON.stringify(buses);
      sessionStorage.setItem("pending_multiple_buses", selected_bus);
      return;
    }

    const start = searchParams.get("fromDate");
    const end = searchParams.get("toDate");
    let actFrom;
    let actTo;
    if (start) {
      const frDate = new Date(start);
      actFrom = frDate.toISOString().split("T")[0];
    }
    if (end) {
      const toDate = new Date(end);
      actTo = toDate.toISOString().split("T")[0];
    }

    const selectedBus = buses
      .map((val) => val.vehicleNumber)
      .filter((id): id is string => id !== null);

    if (!actFrom || !actTo) {
      throw new Error("Start date and end date are required");
    }
    const res = await holdBusAvailability(actFrom, actTo, selectedBus);
    if (res) {
      if (
        Array.isArray(res) &&
        res.map((val) => val.statusCode === 409).includes(true)
      ) {
        setWarningModalOpen(true);
        return;
      }
      const holdKeys = Array.isArray(res)
        ? res.map((item) => item.vehicleHoldKey)
        : [];
      sessionStorage.setItem("vehicleHoldKeys", JSON.stringify(holdKeys));
    }

    router.push(
      `/payments?vehicleNumber=${vehicleNumbers}&isMultipleBooking=${multipleBooking}`
    );
  };

  const rescheduleBookingMutation = useRescheduleBooking();

  const isAdjustTrip = searchParams.get("adjustTrip") === "true";
  const bookingId = searchParams.get("bookingId") || "";

  const fromDates = searchParams.get("fromDate") || "";
  const toDates = searchParams.get("toDate") || "";

  const tripSource = searchParams.get("source") || "";
  const tripDestination = searchParams.get("destination") || "";
  const vehicleCount = searchParams.get("vehicleCount") 
  ? parseInt(searchParams.get("vehicleCount") as string) 
  : null;

const handleReschedule = (busDetails: {
    vehicleNumbers: string[];
    price: number;
    vehicleAC: string;
    sleeper: string;
    vehicleName: string;
    totalAmount: string;
    advanceAmt: string;
    remainingAmt: string;
    advanceAmountNeedToPay: string;
    previousAdvanceAmountPaid: string;
    paymentType: string;
    priceBreakDown: PriceBreakDown | PriceBreakDown[];
}) => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to reschedule your booking?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Reschedule",
        cancelButtonText: "No, Cancel",
        customClass: {
            popup: "w-[430px] !important p-4",
            confirmButton: "px-3 py-1 text-sm",
            cancelButton: "px-3 py-1 text-sm",
        },
    }).then((result) => {
        if (!result.isConfirmed) return;

        const currentFromDate = sessionStorage.getItem("startDate") || fromDates;
        const currentToDate = sessionStorage.getItem("endDate") || toDates;
        if (!currentFromDate || !currentToDate) {
            toast.error("Please select valid dates before rescheduling");
            return;
        }

        let rescheduleVehicleRequests;

        if (isMultipleBooking) {
            // Multiple booking case - each vehicle has its own price breakdown
            const selectedBusDetails = buses!.filter(bus => 
                selectedBuses.includes(bus.vehicleNumber)
            );
            
            rescheduleVehicleRequests = selectedBusDetails.map((bus) => ({
                vehicleNumber: bus.vehicleNumber,
                priceBreakDown: bus.priceBreakDown || {
                    basicFare: "0",
                    driverCharges: "0",
                    tollCharges: "0",
                    gst: "0",
                    totalAmount: "0",
                    platFormFees: "0",
                    gstOnPlatformFees: "0",
                    vendorAmount:"0"
                }
            }));
        } else {
            // Normal case - same price breakdown for all vehicles
            rescheduleVehicleRequests = busDetails.vehicleNumbers.map((vehicleNumber) => ({
                vehicleNumber,
                priceBreakDown: Array.isArray(busDetails.priceBreakDown) 
                    ? busDetails.priceBreakDown[0] || {
                        basicFare: "0",
                        driverCharges: "0",
                        tollCharges: "0",
                        gst: "0",
                        totalAmount: "0",
                        platFormFees: "0",
                        gstOnPlatformFees: "0",
                         vendorAmount:"0"
                    }
                    : busDetails.priceBreakDown || {
                        basicFare: "0",
                        driverCharges: "0",
                        tollCharges: "0",
                        gst: "0",
                        totalAmount: "0",
                        platFormFees: "0",
                        gstOnPlatformFees: "0",
                         vendorAmount:"0"
                    }
            }));
        }

        const requestBody: any = {
            bookingId,
            newStartDate: currentFromDate,
            newEndDate: currentToDate,
            totalAmount: busDetails.totalAmount,
            packagePlaces: null,
            rescheduleVehicleRequests,
        };

        // Check if payment is required
        if (+busDetails.advanceAmountNeedToPay > 0) {
            sessionStorage.setItem("rescheduleData", JSON.stringify(requestBody));

            const formattedAdditionalAmount = parseFloat(
                busDetails.advanceAmountNeedToPay
            ).toFixed(2);

            router.push(
                `/payments?amount=${formattedAdditionalAmount}&isMultipleBooking=${isMultipleBooking}&bookingId=${bookingId}&fromDate=${encodeURIComponent(
                    currentFromDate
                )}&toDate=${encodeURIComponent(currentToDate)}&vehicleNumber=${
                    busDetails.vehicleNumbers.join(',')
                }&totalAmount=${busDetails.totalAmount}&advanceAmt=${
                    busDetails.advanceAmt
                }&remainingAmt=${busDetails.remainingAmt}&advanceAmountNeedToPay=${
                    busDetails.advanceAmountNeedToPay
                }&previousAdvanceAmountPaid=${
                    busDetails.previousAdvanceAmountPaid
                }&vehicleAC=${busDetails.vehicleAC}&sleeper=${
                    busDetails.sleeper
                }&vehicleName=${
                    busDetails.vehicleName
                }&paymentType=${busDetails.paymentType}&tripSource=${tripSource}&tripDestination=${tripDestination}&additionalAmountRequired=true&reschedule=true&rescheduleSuccess=true`
            );
        } else {
            rescheduleBookingMutation.mutate(requestBody, {
                onSuccess: async () => {
                    try {
                        await confirmReschedule(bookingId);
                        Swal.fire({
                            icon: 'success',
                            title: 'Reschedule Successful',
                            text: 'Your trip has been rescheduled successfully.',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            router.push('/');
                        });
                    } catch (error) {
                        toast.error("Failed to confirm reschedule.");
                        console.error("Error confirming reschedule:", error);
                    }
                },
                onError: () => {
                    confirmReschedule(bookingId);
                    toast.error("Something went wrong while rescheduling.");
                },
            });
        }
    });
};


  const handleImageClick = (vehicleNumber: string) => {
    setSelectedActions((prevActions) => ({
      ...prevActions,
      [vehicleNumber]: "Photos", // Set the action for the specific vehicle number to "Photos"
    }));
  };
  useEffect(() => {
    if (isMultipleBooking) {
      dispatch(setSelectedBus(null));
      dispatch(updateSelectedBuses([]));
    } else {
      dispatch(updateSelectedBuses([]));
    }
  }, [isMultipleBooking, dispatch]);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isMultiBookingMode = searchParams.get("isMultipleBooking") === "true";

  const authData = useSelector(selectAuth);
  useEffect(() => {
    // Clear selections when search parameters change (new destination)
    setSelectedBuses([]);
    sessionStorage.removeItem("selectedBuses");
  }, [actualData.source, actualData.destination]);
  useEffect(() => {
    return () => {
      if (!isMultipleBooking) {
        sessionStorage.removeItem("selectedBuses");
      }
    };
  }, [isMultipleBooking]);
  useEffect(() => {
    if (isMultipleBooking) {
      const savedSelectedBuses = sessionStorage.getItem("selectedBuses");
      if (savedSelectedBuses) {
        setSelectedBuses(JSON.parse(savedSelectedBuses));
      }
    } else {
      setSelectedBuses([]);
    }
  }, [isMultipleBooking]); // Watch for route changes
  useEffect(() => {
    async function holdingFnAfterLogin() {
      const isReturningFromPayment = sessionStorage.getItem("returning_from_payment");
      
      // Only proceed if authenticated, not returning from payment, AND has pending bus data
      if (authData.isAuthenticated && !isReturningFromPayment) {
        let hasPendingBusData = false;
        let vehicle_number;
        let bus_ids: string[] = [];
        
        if (isMultipleBooking) {
          const pending_multiple_buses = sessionStorage.getItem("pending_multiple_buses");
          if (pending_multiple_buses) {
            hasPendingBusData = true;
            const parsedBuses = JSON.parse(pending_multiple_buses);
            vehicle_number = parsedBuses
              .map((val: Bus) => val.vehicleNumber)
              .join(",");
            bus_ids = parsedBuses
              .map((val: Bus) => val.vehicleNumber)
              .filter((id: string | null): id is string => id !== null);
          }
        } else {
          const pendingBusData = sessionStorage.getItem("pendingBus");
          if (pendingBusData) {
            hasPendingBusData = true;
            const bus = JSON.parse(pendingBusData);
            vehicle_number = bus.vehicleNumber;
            bus_ids = [bus.vehicleNumber];
            dispatch(setSelectedBus(bus));
          }
        }
  
        // Only proceed with payment flow if we actually have bus data
        if (!hasPendingBusData) {
          return;
        }
  
        let actFrom;
        let actTo;
        if (startDate) {
          const frDate = new Date(startDate);
          actFrom = frDate.toISOString().split("T")[0];
        }
        if (endDate) {
          const toDate = new Date(endDate);
          actTo = toDate.toISOString().split("T")[0];
        }
  
        if (!actFrom || !actTo) {
          throw new Error("Start date and end date are required");
        }
  
        const res = await holdBusAvailability(actFrom, actTo, bus_ids);
        if (res) {
          if (
            Array.isArray(res) &&
            res.map((val) => val.statusCode === 409).includes(true)
          ) {
            setWarningModalOpen(true);
            return;
          }
          const holdKeys = Array.isArray(res)
            ? res.map((item) => item.vehicleHoldKey)
            : [];
          sessionStorage.setItem("vehicleHoldKeys", JSON.stringify(holdKeys));
          sessionStorage.setItem("returning_from_payment", "true");
          if (isMultipleBooking) {
            sessionStorage.removeItem("pending_multiple_buses");
            router.push(
              `/payments?vehicleNumber=${vehicle_number}&isMultipleBooking=${multipleBooking}`
            );
          } else {
            sessionStorage.removeItem("pendingBus");
            router.push(
              `/payments?vehicleNumber=${vehicle_number}&isMultipleBooking=${multipleBooking}`
            );
          }
        }
      }
    }
  
    holdingFnAfterLogin();
  }, [authData.isAuthenticated, isMultipleBooking, startDate, endDate, dispatch, router, multipleBooking]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const bus = query.get("selectedBus");
    if (bus) {
      dispatch(setSelectedBus(JSON.parse(bus)));
    }
  }, []);
  const [showBusModal, setShowBusModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedmodalBus, setSelectedmodalBus] = useState<any | null>(null);

  if(isLoading){
    return <h1></h1>
  }

  return (
    <>
      <WarningModal
        setWarningModalOpen={setWarningModalOpen}
        warningModalOpen={warningModalOpen}
      />
      <div className="min-h-screen">
        <LocationFilter setLoading={setLoading} searchParamsState={searchParamsState}
        setSearchParamsState={setSearchParamsState}/>{" "}
        {isError ? (
          <div>
          <div className="flex flex-col items-center justify-center h-screen">
            <Image
              src="/assests/no_bus_avail.png"
              alt="Error"
              width={500}
              height={500}
              priority
            />
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Buses Available</h2>
        <p className="text-gray-600 mb-6 p-3 md:p-0">
          We couldn't find any buses matching your location or date. Please try adjusting your search or check back later.
        </p>
          </div>
          </div>
        ) : isMobileFilterOpen ? (
          <div className="block lg:hidden fixed inset-0 bg-white z-50">
            <FilterComponent
              setIsMobileFilterOpen={setIsMobileFilterOpen}
              selectedFilter={selectedFilters}
              setSelectedFilter={setSelectedFilters}
            />
          </div>
        ) : (
          <div className="flex w-full p-1">
            <Filter
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
            <div className="w-full">
              <div className="mb-6 w-full">
                <div className="flex flex-col gap-3.5">
                  {/* Display Selected Filters */}
                  <div className="flex flex-wrap gap-2 pt-5">
                    {Object.entries(selectedFilters)
                      .filter(([_, values]) => values.length > 0)
                      .map(([category, values]) =>
                        values.map((value, index) => (
                          <span
                            key={`${category}-${index}`}
                            className="text-xs border border-gray-300 rounded-full text-gray-700 px-3 py-1 flex items-center gap-1.5"
                          >
                            {value}{" "}
                            <RxCross2
                              className="cursor-pointer text-gray-500"
                              onClick={() => removeFilter(category, value)}
                            />
                          </span>
                        ))
                      )}
                  </div>

                  {isMultipleBooking && (
  <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-3 lg:gap-0">
    <p className="text-gray-700 text-xs font-semibold">
      {buses!.length} buses available for the selected location
    </p>
    <button
      className={`${
        isMultiBookingMode
          ? "bg-[#0f7bab] hover:bg-blue-700"
          : "bg-[#162954] hover:bg-[#162954] text-white px-6 py-2 rounded-lg text-xs"
      } text-white px-6 py-2 rounded-lg text-xs ${
        selectedBuses.length <= 1
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-[#0c6a8f]"
      } transition-colors`}
      disabled={selectedBuses.length <= 1}
      onClick={() => {
        if (selectedBuses.length > 0) {
          const selectedBusDetails = buses!.filter((bus) =>
            selectedBuses.includes(bus.vehicleNumber)
          );

          if (isAdjustTrip) {
            // Calculate combined totals
            const combinedTotalAmount = selectedBusDetails.reduce(
              (sum, bus) => sum + parseFloat(bus.totalAmount || "0"), 0
            ).toString();
            
            const combinedAdvanceAmt = selectedBusDetails.reduce(
              (sum, bus) => sum + parseFloat(bus.advanceAmt || "0"), 0
            ).toString();
            
            const combinedRemainingAmt = selectedBusDetails.reduce(
              (sum, bus) => sum + parseFloat(bus.remainingAmt || "0"), 0
            ).toString();
            
            const combinedAdvanceNeedToPay = selectedBusDetails.reduce(
              (sum, bus) => sum + parseFloat(bus.advanceAmountNeedToPay || "0"), 0
            ).toString();
            
            const combinedPreviousAdvance = selectedBusDetails.reduce(
              (sum, bus) => sum + parseFloat(bus.previousAdvanceAmountPaid || "0"), 0
            ).toString();

            // Combine all vehicle numbers
            const allVehicleNumbers = selectedBusDetails.map(bus => bus.vehicleNumber);

            // Combine price breakdowns from all selected buses
            const combinedPriceBreakDown = selectedBusDetails.reduce(
              (combined, bus) => {
                const bd = bus.priceBreakDown || {};
                return {
                  basicFare: (parseFloat(combined.basicFare || "0") + parseFloat(bd.basicFare || "0")).toString(),
                  driverCharges: (parseFloat(combined.driverCharges || "0") + parseFloat(bd.driverCharges || "0")).toString(),
                  tollCharges: (parseFloat(combined.tollCharges || "0") + parseFloat(bd.tollCharges || "0")).toString(),
                  gst: (parseFloat(combined.gst || "0") + parseFloat(bd.gst || "0")).toString(),
                  totalAmount: (parseFloat(combined.totalAmount || "0") + parseFloat(bd.totalAmount || "0")).toString(),
                  platFormFees: (parseFloat(combined.platFormFees || "0") + parseFloat(bd.platFormFees || "0")).toString(),
                  gstOnPlatformFees: (parseFloat(combined.gstOnPlatformFees || "0") + parseFloat(bd.gstOnPlatformFees || "0")).toString(),
                };
              },
              {
                basicFare: "0",
                driverCharges: "0",
                tollCharges: "0",
                gst: "0",
                totalAmount: "0",
                platFormFees: "0",
                gstOnPlatformFees: "0"
              }
            );
            

            // Determine if all buses have same configuration
            const allSameAC = selectedBusDetails.every(b => b.vehicleAC === selectedBusDetails[0].vehicleAC);
            const allSameSleeper = selectedBusDetails.every(b => b.sleeper === selectedBusDetails[0].sleeper);

            const rescheduleData = {
              vehicleNumbers: allVehicleNumbers,
              price: combinedTotalAmount,
              vehicleAC: allSameAC ? selectedBusDetails[0].vehicleAC : "Mixed",
              sleeper: allSameSleeper ? selectedBusDetails[0].sleeper || "" : "Mixed",
              vehicleName: selectedBusDetails.map(bus => bus.vehicleName).join(" | "),    
                        totalAmount: combinedTotalAmount,
              advanceAmt: combinedAdvanceAmt,
              remainingAmt: combinedRemainingAmt,
              advanceAmountNeedToPay: combinedAdvanceNeedToPay,
              previousAdvanceAmountPaid: combinedPreviousAdvance,
              priceBreakDown: selectedBusDetails.map(bus => bus.priceBreakDown || {}),
              platformFee: combinedAdvanceNeedToPay === "0" ? "0" : (500 * selectedBusDetails.length).toString(),
              gstOnPlatformFee: combinedAdvanceNeedToPay === "0" ? "0" : (28 * selectedBusDetails.length).toString(),
              paymentType: selectedBusDetails[0].paymentType,
            };

            handleReschedule(rescheduleData);
          } else {
            handleMultipleBusSelect(selectedBusDetails);
          }
        }
      }}
    >
      {isAdjustTrip ? "Reschedule" : "Book Now"} (
      {selectedBuses.length} selected)
    </button>
  </div>
)}
                </div>
              </div>
              <div className="lg:hidden flex justify-between items-center gap-2 m-2">
                      <h2 className="text-lg font-semibold">Available Vehicles</h2>

                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="relative text-gray bg-gray-200 p-2 rounded-md"
                >
                  <IoFilterOutline className="w-5 h-5" />
                  {isAnyFilterSelected && (
                    <span className="absolute -top-2 -right-1 w-4 h-4 bg-[#0c9cda] text-white text-[10px] flex items-center justify-center rounded-full">
                      {Object.values(selectedFilters).reduce(
                        (acc, filter) => acc + filter.length,
                        0
                      )}
                    </span>
                  )}
                </button>
              </div>
              {/* Bus List */}

              {showLoading ? (
        // Skeleton Loading State
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-150 rounded p-4 shadow-xs w-full flex items-start gap-4"
            >
              <Skeleton className="w-[220px] h-[160px] rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBuses && filteredBuses.length > 0? (
                // No Buses Available Condition
                filteredBuses.map((bus: Bus) => {
                  const maxAmenitiesToShow = 4;

                  const amenitiesToShow = bus.amenities.slice(
                    0,
                    maxAmenitiesToShow
                  );

                  const remainingAmenitiesCount =
                    bus.amenities.length - maxAmenitiesToShow;
                  const imageCount = selectedmodalBus?.s3ImageUrl?.length || 0;
                  const imagemaincount = bus?.s3ImageUrl.length || 0;
                  const visibleImage = bus?.s3ImageUrl?.[0];
                  return (
                    <div
                      key={bus.vehicleNumber}
                      className="border border-gray-150 rounded p-2 shadow-xs mb-4 w-full flex items-center"
                    >
                      {/* Checkbox for Multiple Booking */}
                      {isMultipleBooking && (
  <input
    type="checkbox"
    className="mr-4"
    checked={selectedBuses.includes(bus.vehicleNumber)}
    onChange={() => toggleBusSelection(bus.vehicleNumber)}
    style={{ accentColor: "#0f7bab" }}
    disabled={
      !selectedBuses.includes(bus.vehicleNumber) && 
      vehicleCount !== null && 
      selectedBuses.length >= vehicleCount
    }
  />
)}
                      <div className="flex-1">
                        {/* Bus Info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start w-full p-3 sm:p-4">
                         {/* LEFT: Bus Image - Full width on mobile, fixed width on desktop */}
{/* LEFT: Bus Image - Full width on mobile, fixed width on desktop */}
<div
  className="relative w-full sm:w-[220px] h-[350px] sm:h-[230px] bg-gray-200 overflow-hidden cursor-pointer rounded-lg"
  onClick={() => {
    setSelectedmodalBus(bus);
    setSelectedImage(0);
    setShowBusModal(true);
  }}
>
  {visibleImage ? (
    <>
      <div className="w-full h-full relative">
        <Image
          src={visibleImage.vehicleImageUrl}
          alt={`Bus ${bus.vehicleNumber}`}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={visibleImage.vehicleImageUrl}
          sizes="(max-width: 640px) 100vw, 220px"
          priority={true}  // Optional: if this is above-the-fold content
        />
      </div>
      {imagemaincount > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs px-2 py-1 rounded">
          +{imagemaincount - 1} Photos
        </div>
      )}
    </>
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      No Image
    </div>
  )}
</div>

                          {/* MIDDLE: Info Section */}
                          <div className="flex-1 px-0 sm:px-4 mt-3 sm:ml-4 space-y-2 sm:space-y-3.5 w-full">
                            <h2 className="font-semibold text-lg text-[#1C3366]">
                              {bus.vehicleName}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {bus.vehicleNumber}
                            </p>

                            {/* AC/Non-AC or Sleeper */}
                            {(bus.vehicleAC || bus.sleeper) && (
                              <p className="text-xs text-gray-600">
                                {bus.vehicleAC ? bus.vehicleAC : ""}
                                {bus.vehicleAC && bus.sleeper ? " | " : ""}
                                {bus.sleeper ? bus.sleeper : ""}
                              </p>
                            )}
                            {/* Seater Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-700">
                              <span className="flex items-center gap-1">
                                <Users2 size={14} />
                                {bus.seatCapacity} Seater
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 size={14} />
                                {bus.sleeper}
                              </span>
                            </div>

                            {/* Amenities - Horizontal scroll on mobile */}
                            <div>
                              <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible">
                                {amenitiesToShow
                                  .slice(0, 4)
                                  .map((amenity, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center min-w-[60px]"
                                    >
                                      <img
                                        src={amenity.amenitiesImageUrl}
                                        alt={amenity.amenityName}
                                        className="w-5 h-5"
                                      />
                                      <span className="text-[10px] text-center">
                                        {amenity.amenityName}
                                      </span>
                                    </div>
                                  ))}
                                {remainingAmenitiesCount > 0 && (
                                  <div className="flex flex-col items-center justify-center w-6 h-6 text-xs border border-gray-400 rounded-full">
                                    +{remainingAmenitiesCount}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="sm:hidden">
                              <div className="flex justify-between items-center mt-4">
                                {isAdjustTrip ? (
                                  <div className="flex flex-col">
                                    <div>
                                      <span className="line-through text-gray-500 text-[14px]">
                                        ₹{bus.price}
                                      </span>
                                      <span className="ml-2 font-semibold text-[14px]">
                                        ₹{bus.advanceAmt}
                                      </span>
                                    </div>
                                    <div className="text-[16px] font-semibold mt-1">
                                      Pay ₹{bus.advanceAmountNeedToPay}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <span className="font-semibold">
                                      ₹ {bus?.price}
                                    </span>
                                    <span className="text-xs font-medium text-gray-500">
                                      Base Fare Only
                                    </span>
                                  </div>
                                )}

                                {!isMultipleBooking && (
                                  <button
                                    onClick={() => {
                                      if (isAdjustTrip) {
                                        handleReschedule({
                                          vehicleNumbers: [bus.vehicleNumber],
                                          price: bus.price,
                                          vehicleAC: bus.vehicleAC,
                                          sleeper: bus.sleeper ?? "",
                                          vehicleName: bus.vehicleName,
                                          totalAmount:
                                            bus.totalAmount?.toString() ?? "",
                                          advanceAmt:
                                            bus.advanceAmt?.toString() ?? "",
                                          remainingAmt:
                                            bus.remainingAmt?.toString() ?? "",
                                          advanceAmountNeedToPay:
                                            bus.advanceAmountNeedToPay?.toString() ??
                                            "",
                                          previousAdvanceAmountPaid:
                                            bus.previousAdvanceAmountPaid?.toString() ??
                                            "",
                                            paymentType: bus.paymentType,
                                            priceBreakDown:bus.priceBreakDown
                                        });
                                      } else {
                                        handleBusSelect(bus);
                                      }
                                    }}
                                    className="bg-[#1C3366] hover:bg-[#162954] text-white text-xs sm:text-sm font-medium px-4 py-1.5 rounded-md cursor-pointer"
                                  >
                                    {isAdjustTrip ? "Reschedule" : "Book Now"}
                                  </button>
                                )}
                              </div>

                             
{/* Mobile/Modal action section */}
<div className="hidden sm:flex gap-2 flex-wrap items-end justify-end pr-8 text-[#01374e]">
  {Object.keys(actionContent).map((item) => (
    <span
      key={item}
      className={`cursor-pointer flex items-center gap-0.5 text-sm font-medium underline ${
        selectedActions[bus.vehicleNumber] === item
          ? "text-[#0f7bab]"
          : ""
      }`}
      onClick={() =>
        toggleAction(
          bus.vehicleNumber,
          item
        )
      }
    >
      {item} <RiArrowDropDownLine />
    </span>
  ))}
</div>
                            </div>
                          </div>

                          {/* RIGHT: Price and CTA - Hidden on mobile (shown in middle section) */}
                          <div className="hidden sm:flex flex-col justify-between items-end min-w-[150px] mt-[55px] h-full">
                            {isAdjustTrip ? (
                              <div className="flex flex-col items-end">
                                <div>
                                  <span className="line-through text-gray-500 text-[14px]">
                                    ₹{bus.totalAmount}
                                  </span>
                                  <span className="ml-2 font-semibold text-[14px]">
                                    ₹{bus.advanceAmt}
                                  </span>
                                </div>
                                <div className="text-[16px] font-semibold mt-[20px]">
                                  Pay ₹{bus.advanceAmountNeedToPay}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="font-semibold">
                                  ₹ {bus?.price}
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                  Base Fare Only
                                </span>
                              </div>
                            )}

                            {!isMultipleBooking && (
                              <button
                                onClick={() => {
                                  if (isAdjustTrip) {
                                    handleReschedule({
                                      vehicleNumbers: [bus.vehicleNumber],
                                      price: bus.price,
                                      vehicleAC: bus.vehicleAC,
                                      sleeper: bus.sleeper ?? "",
                                      vehicleName: bus.vehicleName,
                                      totalAmount:
                                        bus.totalAmount?.toString() ?? "",
                                      advanceAmt:
                                        bus.advanceAmt?.toString() ?? "",
                                      remainingAmt:
                                        bus.remainingAmt?.toString() ?? "",
                                      advanceAmountNeedToPay:
                                        bus.advanceAmountNeedToPay?.toString() ??
                                        "",
                                      previousAdvanceAmountPaid:
                                        bus.previousAdvanceAmountPaid?.toString() ??
                                        "",
                                      paymentType: bus.paymentType,
                                      priceBreakDown:bus.priceBreakDown
                                    });
                                  } else {
                                    handleBusSelect(bus);
                                  }
                                }}
                                className="mt-4 bg-[#1C3366] hover:bg-[#162954] text-white text-sm font-medium px-5 py-2 rounded-md cursor-pointer w-full sm:w-auto"
                              >
                                {isAdjustTrip ? "Reschedule" : "Book Now"}
                              </button>
                            )}
                          </div>
                          {showBusModal && selectedmodalBus && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                              <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
                                {/* Header with close button */}
                                <div className="flex justify-between items-center p-4 border-b">
                                  <h3 className="text-lg font-medium"></h3>
                                  <button
                                    onClick={() => setShowBusModal(false)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                  >
                                    <svg
                                      className="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {/* Image Carousel */}
                                <div className="p-4">
                                  <Carousel
                                    opts={{
                                      startIndex: selectedImage,
                                      loop: true,
                                    }}
                                    className="w-full"
                                    setApi={(api) => {
                                      api?.on("select", () => {
                                        setSelectedImage(
                                          api.selectedScrollSnap()
                                        );
                                      });
                                    }}
                                  >
                                    <CarouselContent>
                                      {selectedmodalBus.s3ImageUrl?.map(
                                        (image: any, index: any) => (
                                          <CarouselItem key={index}>
                                            <div className="relative w-full h-64 sm:h-96 bg-gray-100 rounded-md overflow-hidden">
                                              <Image
                                                src={image.vehicleImageUrl}
                                                alt={`Bus ${
                                                  selectedmodalBus.vehicleNumber
                                                } ${index + 1}`}
                                                fill
                                                className="object-contain"
                                                priority={
                                                  index === selectedImage
                                                }
                                              />
                                            </div>
                                          </CarouselItem>
                                        )
                                      )}
                                    </CarouselContent>

                                    {/* Navigation Arrows - improved styling */}
                                    <CarouselPrevious className="left-2 size-10 bg-white/90 hover:bg-white shadow-md" />
                                    <CarouselNext className="right-2 size-10 bg-white/90 hover:bg-white shadow-md" />
                                  </Carousel>

                                  {/* Image Count Indicator */}
                                  <div className="text-center text-sm text-gray-700 mt-4 pb-2">
                                    {selectedImage + 1} /{" "}
                                    {selectedmodalBus.s3ImageUrl?.length || 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                     {/* Action dropdown section */}
                     <div className="flex gap-2 flex-wrap items-start justify-end mt-2 text-[#01374e]">
                     {Object.keys(actionContent).map((item) => (
    <span
      key={item}
      className={`cursor-pointer flex items-center gap-0.5 text-sm font-medium underline ${
        selectedActions[bus.vehicleNumber] === item
          ? "text-[#0f7bab]"
          : ""
      }`}
      onClick={() =>
        toggleAction(
          bus.vehicleNumber,
          item
        )
      }
    >
      {item} <RiArrowDropDownLine />
    </span>
  ))}
</div>

                        {/* Seat Info */}

                        {/* Actions */}

                        {/* Actions Expansion */}
                        {selectedActions[bus?.vehicleNumber] && (
  <div
    className={`${
      selectedActions[bus?.vehicleNumber] === "Photos"
        ? ""
        : "bg-gray-100"
    }`}
  >
    <div
      className={`mt-2 p-2 sm:mt-3 sm:p-3 ${
        selectedActions[bus?.vehicleNumber] === "Photos"
          ? ""
          : "bg-gray-100"
      }`}
    >
     {/* Content display section */}
{selectedActions[bus.vehicleNumber] && (
  <div className={selectedActions[bus.vehicleNumber] === "Photos" ? "" : "bg-gray-100"}>
    <div className={`mt-2 p-2 sm:mt-3 sm:p-3 ${
      selectedActions[bus.vehicleNumber] === "Photos" ? "" : "bg-gray-100"
    }`}>
      {selectedActions[bus.vehicleNumber] === "Photos" &&
      (bus?.s3ImageUrl?.length ?? 0) > 0 ? (
        <ImageSlider
          photos={
            bus?.s3ImageUrl?.map(
              (image) => image.vehicleImageUrl
            ) ?? []
          }
        />
      ) : selectedActions[bus.vehicleNumber] === "Amenities" &&
        (bus?.amenities?.length ?? 0) > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
          {bus?.amenities?.map((amenity, index) => (
            <li
              key={index}
              className="flex items-center gap-2"
            >
              <img
                src={amenity.amenitiesImageUrl}
                alt={amenity.amenityName}
                className="w-4 h-4"
              />
              {amenity.amenityName}
            </li>
          ))}
        </ul>
      ) : selectedActions[bus.vehicleNumber] === "Policies" ? (
        bus?.policies && bus.policies.length > 0 ? (
          <ul className="text-xs text-gray-600">
            {bus.policies.map((policy, index) => (
              <li
                key={index}
                className="flex flex-col gap-1 mb-2"
              >
                <span className="font-medium text-gray-800">
                  {policy.policyDescription}:
                </span>
                <ul className="list-disc list-inside pl-2">
                  {policy.policyData.map((data) => (
                    <li key={data.id}>
                      {data.policyMessage}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-600">
            Policies are updated by the particular vendor.
          </p>
        )
      ) :     selectedActions[bus.vehicleNumber] === "Reviews" ? (
  <div className="space-y-4">
    {/* Reviews Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
        {bus.reviewResponse && bus.reviewResponse.reviews.length > 0 && (
          <div className="flex items-center mt-1">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(bus.reviewResponse.reviewAverage)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {bus.reviewResponse.reviewAverage.toFixed(1)} ({bus.reviewResponse.totalNumberOfReviews} reviews)
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Reviews List */}
    {bus.reviewResponse && bus.reviewResponse.reviews.length > 0 ? (
      <div className="space-y-5">
        {bus.reviewResponse.reviews.map((review) => (
          <div key={review.reviewId} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{review.userName}</h4>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-sm text-gray-700 mt-2 mb-3">{review.description}</p>

            {/* Media Gallery - Simplified version without lightbox */}
           {(review?.images.length > 0 || review?.videos.length > 0) && (
  <div className="mt-3">
    <h5 className="text-xs font-medium text-gray-500 mb-2">MEDIA</h5>
    <div className="flex flex-wrap gap-2">
      {/* Images */}
      {review.images.map((img, idx) => (
        <div
          key={idx}
          className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedMedia({ url: img.mediaUrl, type: 'image' })}
        >
          <img
            src={img.mediaUrl}
            alt={`Review ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-10 transition-all" />
        </div>
      ))}

      {/* Videos */}
      {review?.videos?.map((video, idx) => (
        <div
          key={`video-${idx}`}
          className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedMedia({ url: video.mediaUrl, type: 'video' })}
        >
          <video className="w-full h-full object-cover">
            <source src={video.mediaUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      ))}
         </div>
  </div>
)}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to share your experience with this vehicle.
        </p>
      </div>
    )}
  </div>
) : (
  <div className="p-4 text-center">
    <p className="text-sm text-gray-600">
      {actionContent[selectedActions[bus.vehicleNumber] ?? ""]}
    </p>
  </div>
)}

    </div>
  </div>
)}
    </div>
  </div>
)}
                      </div>
                    </div>
                  );
                })
                
              ) : (
                <div className="flex items-center justify-center">
                <Image
                  src="/assests/no_bus_avail.png"
                  alt="No buses available"
                  width={500}
                  height={500}
                  priority
                />
              </div>
              )}
            </div>
          </div>
        )}
        {isLoginModalOpen && (
          <LoginModal onClose={() => setIsLoginModalOpen(false)} />
        )}
        <MediaModal 
  media={selectedMedia} 
  onClose={() => setSelectedMedia(null)} 
/>
      </div>
    </>
  );
};
interface ImageSliderProps {
  photos: string[];
  mobileFullWidth?: boolean;
  hideArrowsOnMobile?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div {...handlers} className=" relative w-full max-w-xl mx-auto ">
      <div className="flex justify-center items-center gap-4 ">
        <IoIosArrowBack
          onClick={prevSlide}
          className="bg-[#0f7bab] text-white cursor-pointer text-4xl p-2 rounded-full shadow-md hover:bg-[#bdd8e4]"
        />
        <Image
          src={photos[currentIndex]}
          width={600}
          height={400}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-[200px] object-cover sm:h-[300px] sm:w-[450px] xs:h-[200px] xs:w-[300px]"
          loading="lazy"
        />
        <IoIosArrowForward
          onClick={nextSlide}
          className=" bg-[#0f7bab] text-white cursor-pointer text-4xl p-2 rounded-full shadow-md hover:bg-[#bdd8e4]"
        />
      </div>

      <div className="flex justify-center mt-3 space-x-2 sm:flex">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-[#0f7bab]" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
      
    </div>
  );
};

export default List;