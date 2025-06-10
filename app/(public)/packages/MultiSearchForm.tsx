import React, { useEffect, useState, useRef, useMemo } from "react";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdMovieEdit } from "react-icons/md";
import { addDays, isToday, isSameDay, set, isBefore } from "date-fns";
import { useSearchParams } from "next/navigation";
import ClockTimePicker from "../home/ClockTimePicker";
import toast from "react-hot-toast";
import { format, parseISO } from 'date-fns';

interface MultiSearchFormProps {
  source: string;
  drop: string;
  days: number;
  packageName: string;
  fetchVehicleList: (fromDate: string, packageTitle: string, source: string, sourceLatitude: number, sourceLongitude: number) => void;
  onDateChange: (fromDate: Date, toDate: Date) => void;
  InitialFromDate: Date;
  InitialEndDate: Date;
  onSourceChange?: (newSource: string) => void;
}

const STORAGE_KEY = 'multiSearchFormDates';
const PACKAGE_STORAGE_KEY = "package_form__data";

const getStoredDates = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          startDate: parsed.startDate ? new Date(parsed.startDate) : null,
          endDate: parsed.endDate ? new Date(parsed.endDate) : null
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  return null;
};

const storeDates = (startDate: Date, endDate: Date) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString() ?? undefined,
    }));
  }
};

const clearStoredDates = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const MultiSearchForm = ({
  source,
  drop,
  days,
  packageName,
  fetchVehicleList,
  onDateChange,
  InitialFromDate,
  InitialEndDate,
  onSourceChange,
}: MultiSearchFormProps) => {
  const searchParams = useSearchParams();
  
  const getInitialDates = () => {
    // First try to get date from URL parameters
    const toDateParam = searchParams.get('toDate');

    
    
    
    // Then check session storage
    const packageData = sessionStorage.getItem(PACKAGE_STORAGE_KEY);
  
    if (packageData) {
      try {
        const { fromDate, toDate, packageTitle, source, sourceLatitude, sourceLongitude, days } = JSON.parse(packageData);
  
        if (fromDate) {
          const startDate = new Date(fromDate);
          
          // Use URL toDate if available, otherwise use storage toDate
          const endDate =  (toDate ? new Date(toDate) : null);
          
          // Validate dates
          if (!isNaN(startDate.getTime()) && (!endDate || !isNaN(endDate.getTime()))) {
            return {
              source,
              startDate,
              endDate,
              sourceLatitude,
              sourceLongitude,
              packageTitle,
              days
            };
          }
        }
      } catch (e) {
      }
    }
    
    // Finally check localStorage for stored dates
    const storedDates = getStoredDates();
    if (storedDates && storedDates.startDate && storedDates.endDate) {
      return {
        source: source || "",
        startDate: storedDates.startDate,
        endDate:  storedDates.endDate,
        sourceLatitude: null,
        sourceLongitude: null,
        packageTitle: packageName || "",
        days: days || 1
      };
    }
  
    // Fallback to initial props
    return {
      source: source || "",
      startDate: InitialFromDate,
      endDate: InitialEndDate,
      sourceLatitude: null,
      sourceLongitude: null,
      packageTitle: packageName || "",
      days: days || 1
    };
  };
  
  const initialDates = getInitialDates();
  
  const [startDate, setStartDate] = useState<Date | null>(() => {
    return initialDates.startDate && !isNaN(initialDates.startDate.getTime()) 
      ? initialDates.startDate 
      : InitialFromDate;
  });
  
  const [endDate, setEndDate] = useState<Date | null>(() => {
    return initialDates.endDate && !isNaN(initialDates.endDate.getTime()) 
      ? initialDates.endDate 
      : InitialEndDate;
  });
  
  const [sourceLatitude, setSourceLatitude] = useState(initialDates.sourceLatitude);
  const [sourceLongitude, setSourceLongitude] = useState(initialDates.sourceLongitude);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSource, setEditedSource] = useState(initialDates.source);
  
  const from = searchParams.get('source');
  const to = searchParams.get('destination');
  const adjustTrip = searchParams.get("adjustTrip");
  const isReshedule = searchParams.get("isReschedule") === "true";

  // Time picker states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<DatePicker>(null);
  const endDateRef = useRef<DatePicker>(null);
  const sourceInputRef = useRef<HTMLInputElement | null>(null);
  const sourceAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Debug logging for dates
  useEffect(() => {

  }, [startDate, endDate]);

  // Listen for changes in session storage
  useEffect(() => {
    if (isEditing) {
      return;
    }
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PACKAGE_STORAGE_KEY && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue);
          if (newData.fromDate) {
            const newStartDate = new Date(newData.fromDate);
            if (!isNaN(newStartDate.getTime())) {
              setStartDate(newStartDate);
              
              if (newData.toDate) {
                const newEndDate = new Date(newData.toDate);
                if (!isNaN(newEndDate.getTime())) {
                  setEndDate(newEndDate);
                }
              }

              if (newData.sourceLatitude !== undefined) {
                setSourceLatitude(newData.sourceLatitude);
              }
              if (newData.sourceLongitude !== undefined) {
                setSourceLongitude(newData.sourceLongitude);
              }
              if (newData.source) {
                setEditedSource(newData.source);
              }
            }
          }
        } catch (e) {
          console.error("Error handling storage change:", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const checkSessionStorage = () => {
      if (isEditing) {
        return;
      }
      
      const packageData = sessionStorage.getItem(PACKAGE_STORAGE_KEY);
      if (packageData) {
        try {
          const parsedData = JSON.parse(packageData);
          if (parsedData.fromDate) {
            const newStartDate = new Date(parsedData.fromDate);
            if (!isNaN(newStartDate.getTime()) && 
                (!startDate || startDate.getTime() !== newStartDate.getTime())) {
              setStartDate(newStartDate);
              
              if (parsedData.toDate) {
                const newEndDate = new Date(parsedData.toDate);
                if (!isNaN(newEndDate.getTime())) {
                  setEndDate(newEndDate);
                }
              }

              if (parsedData.sourceLatitude !== undefined) {
                setSourceLatitude(parsedData.sourceLatitude);
              }
              if (parsedData.sourceLongitude !== undefined) {
                setSourceLongitude(parsedData.sourceLongitude);
              }
              if (parsedData.source) {
                setEditedSource(parsedData.source);
              }
            }
          }
        } catch (e) {
          console.error("Error checking session storage:", e);
        }
      }
    };

    checkSessionStorage();
    
    const intervalId = setInterval(checkSessionStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [days, isEditing, startDate]);
  
  const validEndDateRange = useMemo(() => {
    if (!startDate) return { minDate: null, maxDate: null };
  
    let minDate;
    if (days === 1) {
      minDate = new Date(startDate);
    } else {
      minDate = new Date(startDate);
      minDate.setDate(startDate.getDate() + 1);
    }
    
    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + days);
    
    return { minDate, maxDate };
  }, [startDate, days]);
  
  useEffect(() => {
    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      storeDates(startDate, endDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!startDate) return;
    
    // Add a flag to track if the end date was manually set
    const wasManuallySet = sessionStorage.getItem('endDateManuallySet') === 'true';
    
    // Only auto-calculate end date if we don't have one or if it's not valid
    // if ((!endDate || isNaN(endDate.getTime()) || isBefore(endDate, startDate)) && !wasManuallySet) {
    //   let calculatedEndDate = new Date(startDate);
    //   if (days === 1) {
    //     calculatedEndDate.setHours(22, 0, 0, 0);
    //   } else {
    //     calculatedEndDate = addDays(startDate, days - 1);
    //     calculatedEndDate.setHours(22, 0, 0, 0);
    //   }
    //   setEndDate(calculatedEndDate);
    // }
  }, [startDate, days, adjustTrip, isReshedule, endDate]);
  
  const handleStartDateChange = (date: Date | null) => {
    if (!date) {
      setStartDate(null);
      // Don't automatically reset end date
      return;
    }

    setStartDate(date);
    setShowStartTimePicker(true);
  };

  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    // Ensure endDate is not before startDate
    if (startDate && endDate && isBefore(endDate, startDate)) {
      if (adjustTrip === "true" || isReshedule) {
        // In adjust/reschedule mode, keep the end date even if it's before start
        // This might be required by business logic
      } else {
        // In normal mode, set end date to be after start date
        // const newEndDate = new Date(startDate);
        // if (days === 1) {
        //   newEndDate.setHours(22, 0, 0, 0);
        // } else {
        //   newEndDate.setDate(startDate.getDate() + days - 1);
        //   newEndDate.setHours(22, 0, 0, 0);
        // }
        // setEndDate(newEndDate);
      }
    }
  }, [startDate, adjustTrip, isReshedule, days]);
  
  useEffect(() => {
    const isValid = (
      (editedSource || from || source) && 
      (to || drop) && 
      (startDate instanceof Date) && !isNaN(startDate.getTime()) && 
      (endDate instanceof Date) && !isNaN(endDate.getTime())
    );
    setIsFormValid(!!isValid);
  }, [editedSource, from, source, to, drop, startDate, endDate]);
  
  const handleStartTimeSelected = (date: Date) => {
    setStartDate(date);
    setShowStartTimePicker(false);
    setEndDate(null); 
    
  };

  const handleEndTimeSelected = (date: Date) => {
    if (!startDate) return;

    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(startDate.getDate() + days);
    
    if (date > maxEndDate) {
      setEndDate(maxEndDate);
    } else if (isBefore(date, startDate)) {
      // Ensure end date is not before start date
      const newEndDate = new Date(startDate);
      newEndDate.setHours(date.getHours(), date.getMinutes());
      setEndDate(newEndDate);
    } else {
      setEndDate(date);
    }
    
    // Mark as manually set
    sessionStorage.setItem('endDateManuallySet', 'true');
    setShowEndTimePicker(false);
  };

  const [sourceCoords, setSourceCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  
  const handlePlaceChanged = (
    ref: React.MutableRefObject<google.maps.places.Autocomplete | null>,
    setter: (value: string) => void,
    fieldName: string
  ) => {
    if (ref.current) {
      const place = ref.current.getPlace();
      if (place?.formatted_address) {
        setter(place.formatted_address);
      } else {
        toast.error(`Please select a valid ${fieldName}.`);
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
          setSourceLatitude(location.lat);
          setSourceLongitude(location.lng);
        }

       
      } else {
        toast.error("Unable to fetch coordinates for the location.");
      }
    } catch (error) {
      toast.error("Error fetching coordinates.");
    }
  };
  
 useEffect(() => {
    const initializeAutocomplete = () => {
      if (
        isEditing &&
        sourceInputRef.current &&
        !sourceAutocompleteRef.current &&
        window.google?.maps?.places
      ) {
  
        sourceAutocompleteRef.current = new window.google.maps.places.Autocomplete(
          sourceInputRef.current,
          {
            fields: ["formatted_address", "geometry", "address_components", "name"],
            types: ["establishment", "geocode"], // Include both establishments and addresses
            componentRestrictions: { country: "in" },
          }
        );
  
        // Karnataka bounds
        const karnatakaBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(11.5, 74.0), // SW
          new window.google.maps.LatLng(18.5, 78.5)  // NE
        );
        sourceAutocompleteRef.current.setBounds(karnatakaBounds);
  
        sourceAutocompleteRef.current.addListener("place_changed", () => {
          const place = sourceAutocompleteRef.current?.getPlace();
          if (!place || (!place.address_components && !place.geometry)) {
            toast.error("Please select a valid pickup location.");
            return;
          }
  
          // For establishments (companies) that might not have address_components
          // we need to check their geometry location against Karnataka bounds
          let isInKarnataka = false;
          
          if (place.address_components) {
            // Check via address component (for addresses)
            const stateComponent = place.address_components.find(component =>
              component.types.includes("administrative_area_level_1")
            );
            isInKarnataka = stateComponent?.long_name === "Karnataka";
          } else if (place.geometry?.location) {
            // Check via geometry (for establishments)
            isInKarnataka = karnatakaBounds.contains(place.geometry.location);
          }
  
          const formattedAddress = place.formatted_address || place.name;
  
          if (isInKarnataka && formattedAddress) {
            setEditedSource(formattedAddress);
            fetchCoordinates(formattedAddress, "source");
          } else {
            toast.error("Please select a location within Karnataka.");
            setEditedSource("");
          }
        });
      }
    };
  
    if (window.google?.maps?.places) {
      initializeAutocomplete();
    } else if (isEditing) {
      const googleMapScript = document.getElementById("google-maps-script");
  
      if (!googleMapScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU&libraries=places`;
        script.async = true;
        script.defer = true;
  
        script.onload = () => {
          initializeAutocomplete();
        };
  
        script.onerror = () => {
          toast.error("Failed to load location search. Please try again.");
        };
  
        document.head.appendChild(script);
      }
    }
  
    return () => {
      if (!isEditing && sourceAutocompleteRef.current) {
        sourceAutocompleteRef.current = null;
      }
    };
  }, [isEditing]);
  
  const handleButtonClick = () => {
    setIsEditing((prev) => {
      const newState = !prev;
  
      if (prev) {
        // Editing mode → Save logic
  
        if (!editedSource.trim()) {
          toast.error("Please enter a pickup location");
          return prev; // prevent toggle if invalid
        }
  
        if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          toast.error("Please select valid dates");
          return prev; // prevent toggle if dates are invalid
        }
  
        const fromDateStr = startDate.toLocaleString('sv-SE', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        }).replace(' ', 'T');
  
        const updatedPackageData = {
          fromDate: fromDateStr,
          toDate: endDate.toISOString(),
          packageTitle: packageName,
          source: editedSource,
          sourceLatitude: sourceLatitude,
          sourceLongitude: sourceLongitude,
          days: days,
        };
  
        const packageFormData = {
          fromDate: startDate,
          toDate: endDate,
          packageTitle: packageName,
          source: editedSource,
          sourceLatitude: sourceLatitude,
          sourceLongitude: sourceLongitude,
          days: days,
        };
  
        sessionStorage.setItem(
          "package_form__data",
          JSON.stringify(packageFormData)
        );
  
        fetchVehicleList(
          fromDateStr!,
          packageName,
          editedSource,
          sourceLatitude,
          sourceLongitude
        );
  
        onDateChange(startDate, endDate);
        storeDates(startDate, endDate);
        if (onSourceChange) onSourceChange(editedSource);
  
      } else {
        // Enter edit mode
        sourceAutocompleteRef.current = null;
        setTimeout(() => {
          sourceInputRef.current?.focus();
        }, 0);
      }
  
      return newState;
    });
  };
  
  const handleStartTimeChange = (date: Date) => {
    setStartDate(date);
    setShowStartTimePicker(false);
  };
  
  const handleEndDateChange = (date: Date | null) => {
    if (!date || !startDate) {
      setEndDate(date);
      return;
    }
    
    // Preserve the existing time if it's set and valid
    const newEndDate = new Date(date);
    if (endDate && !isNaN(endDate.getTime())) {
      newEndDate.setHours(endDate.getHours());
      newEndDate.setMinutes(endDate.getMinutes());
    } else {
      newEndDate.setHours(startDate.getHours());
      newEndDate.setMinutes(startDate.getMinutes());
    }
    
    setEndDate(newEndDate);
    setShowEndTimePicker(true);
    
    // Set a flag that the end date was manually selected
    sessionStorage.setItem('endDateManuallySet', 'true');
  };
  
  const isEndDateSelectable = (date: Date) => {
    if (!startDate) return false;
    
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    const startDateCopy = new Date(startDate);
    startDateCopy.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(startDateCopy);
    maxDate.setDate(startDateCopy.getDate() + days);
    
    if (days === 1) {
      return dateToCheck >= startDateCopy && dateToCheck <= maxDate;
    }
    
    return dateToCheck > startDateCopy && dateToCheck <= maxDate;
  };
  
  const handleDateEditClick = (inputRef: React.RefObject<DatePicker | null>) => {
    if (inputRef.current) {
      inputRef.current.setOpen(true);
    }
  };
  
  useEffect(() => {
    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      storeDates(startDate, endDate);
      
      // Also store the end date in sessionStorage to make sure it persists
      const packageData = sessionStorage.getItem("package_form__data");
      if (packageData) {
        try {
          const parsedData = JSON.parse(packageData);
          parsedData.toDate = endDate.toISOString();
          sessionStorage.setItem("package_form__data", JSON.stringify(parsedData));
        } catch (e) {
          console.error("Error updating session storage with end date:", e);
        }
      }
    }
  }, [startDate, endDate]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSource(e.target.value);
  };

  // Safe formatting function
  const formatDate = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) {
      return "Select date";
    }
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="bg-[#01374e] py-3 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between w-full max-w-8xl mx-auto mt-1.5 mb-3 lg:mb-0 px-4 md:px-6 lg:px-7 gap-3 md:gap-4 relative">
      {/* Source - Now editable */}
      <div className={`relative flex items-center rounded-md px-3 py-2 w-full md:w-1/5 flex-shrink-0 border transition-all duration-300 ${
  isEditing && !adjustTrip ? "bg-white shadow-md" : "border border-gray-300 bg-white" // Gray background when disabled
}`}>
  <FaPaperPlane className="text-sm text-[#01374e] flex-shrink-0 mr-2" />
  {isEditing && !adjustTrip ? (
    <input
      type="text"
      placeholder="PickUp Location in Karnataka"
      className="w-full text-sm focus:outline-none"
      value={editedSource}
      ref={sourceInputRef}
      onChange={(e) => {
        setEditedSource(e.target.value);
      }}
      autoComplete="off"
      style={{ 
        zIndex: 1000
      }}
    />
  ) : (
    <span className="text-xs font-semibold text-[#003B4A] truncate flex-1 min-w-0">
      {editedSource || source}
    </span>
  )}
</div>
    
      {/* Drop */}
      <div className="relative flex items-center rounded-md px-3 py-2 w-full md:w-1/5 flex-shrink-0 border transition-all duration-300 bg-[#fff] min-w-0 overflow-hidden">
        <FaMapMarkerAlt className="text-sm text-[#01374e] flex-shrink-0 mr-2" />
        <span className="text-xs font-semibold text-[#003B4A] truncate flex-1 min-w-0">
          {to ? to : drop}
        </span>
      </div>
    
      {/* Start Date */}
      <div className={`relative flex items-center rounded-md px-3 py-2 w-full md:w-auto flex-grow border transition-all duration-300 ${
        isEditing ? "bg-[#fff] shadow-l" : "bg-white"
      }`}>
        {isEditing ? (
          <>
            <MdMovieEdit className="text-blue-500 text-lg mr-2" />
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={addDays(new Date(), 1)}
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="dd MMM yyyy h:mm aa"
              className="text-[#01374e] text-xs font-semibold focus:outline-none w-full cursor-pointer bg-transparent"
              placeholderText="Start Date & Time"
              readOnly={!isEditing}
              ref={startDateRef}
              onClickOutside={() => setShowStartTimePicker(false)}
            />
          </>
        ) : (
          <>
            <MdDateRange className="text-[#01374e] text-sm mr-2" />
            <span className="text-xs font-semibold text-[#003B4A] truncate">
              {startDate?.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </span>
          </>
        )}
      </div>
     
      {/* End Date */}
      <div className={`relative flex items-center rounded-md px-3 py-2 w-full md:w-auto flex-grow border transition-all duration-300 ${
        isEditing ? "bg-[#fff] shadow-l" : "bg-white"
      }`}>
        {isEditing ? (
          <>
            <MdMovieEdit className="text-blue-500 text-lg mr-2" />
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              minDate={validEndDateRange.minDate ?? undefined}
              maxDate={validEndDateRange.maxDate ?? undefined}
              customInput={
                <div className={`flex items-center w-full ${startDate ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                 
                  <span className="text-xs font-semibold text-[#003B4A]">
                    {endDate ? format(endDate, 'dd MMM yyyy h:mm a') : 'Select end date'}
                  </span>
                </div>
              }
              dateFormat="dd MMM yyyy h:mm a"
            
              timeFormat="HH:mm"
              timeIntervals={60}
              ref={endDateRef}
              disabled={!startDate}
              filterDate={isEndDateSelectable}
            />
          </>
        ) : (
          <>
            <MdDateRange className="text-[#01374e] text-sm mr-2" />
            <span className="text-xs font-semibold text-[#003B4A] truncate">
              {endDate?.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </span>
          </>
        )}
      </div>
       <style jsx global>{`
       .pac-container {
  z-index: 1050 !important; /* Make sure it's above other UI elements */
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 2px;
    background-color: #ffff !important;
    
}
.pac-item {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}
.pac-item:hover {
  background-color: #f3f4f6 !important;
}
.pac-matched {
  font-weight: 600;
}`}</style>
      {/* Time Pickers */}
      {showStartTimePicker && startDate && (
        <div ref={startTimeRef}>
          <ClockTimePicker
            selectedTime={startDate}
            isPackage={true}
            onChange={handleStartTimeSelected}
            onClose={() => setShowStartTimePicker(false)}
            startDate={null}
            isEndDatePicker={false}
            style={{position:'absolute',top:'15vh',right:'40vw'}}
          />
        </div>
      )}
       {showEndTimePicker && endDate && (
        <ClockTimePicker
          selectedTime={endDate}
          isPackage={true}
          onChange={handleEndTimeSelected}
          onClose={() => setShowEndTimePicker(false)}
          startDate={startDate!}
          numberOfDays={days}
          isEndDatePicker={true}
          style={
            typeof window !== "undefined" && window.innerWidth < 620
              ? { position: "absolute", left: "3vw", top: "30%" }
              : { position: "absolute", top: "15vh", right: "15vw" }
          }
        />
      )}
    
      {/* Modify/Search Button */}
      <button
        onClick={handleButtonClick}
        disabled={isEditing && !isFormValid}
        className={`px-4 py-2 rounded-xl text-sm font-semibold min-w-[100px] cursor-pointer ${
          isEditing
            ? "bg-[#0f7bab] text-white"
            : "border border-[#0f7bab] text-[#0f7bab] bg-white"
        } ${
          (isEditing && !isFormValid) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isEditing ? "Search" : "Modify"}
      </button>
    
      {/* Global Styles for DatePicker */}
      <style jsx global>{`
        .react-datepicker {
          border-radius: 0.5rem;
          border-color: #e5e7eb;
          font-size: 14px;
          display:flex;
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
        .react-datepicker__month-container + .react-datepicker__month-container {
          margin-left: 1rem;
        }
        .react-datepicker__day--selected:not(.react-datepicker__day--outside-month) {
          background-color: #0f7bab !important;
          color: white !important;
          margin:0;
          border-radius:50%;
        }
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled {
          color:#ccc!important;
          cursor:not-allowed!important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          color: white !important;
          margin:0;
        }
        .react-datepicker__day--in-range {
          background-color: rgba(59, 130, 246, 0.2) !important;
          color: black !important;
          border-radius: 0 !important;
          margin:0;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
          width:2rem!important;
          line-height:2rem!important;
          margin:0!important;
        }
        .react-datepicker__day--selected:not([aria-disabled=true]):hover, 
        .react-datepicker__day--in-selecting-range:not([aria-disabled=true]):hover, 
        .react-datepicker__day--in-range:not([aria-disabled=true]):hover, 
        .react-datepicker__month-text--selected:not([aria-disabled=true]):hover, 
        .react-datepicker__month-text--in-selecting-range:not([aria-disabled=true]):hover, 
        .react-datepicker__month-text--in-range:not([aria-disabled=true]):hover, 
        .react-datepicker__quarter-text--selected:not([aria-disabled=true]):hover, 
        .react-datepicker__quarter-text--in-selecting-range:not([aria-disabled=true]):hover, 
        .react-datepicker__quarter-text--in-range:not([aria-disabled=true]):hover, 
        .react-datepicker__year-text--selected:not([aria-disabled=true]):hover, 
        .react-datepicker__year-text--in-selecting-range:not([aria-disabled=true]):hover, 
        .react-datepicker__year-text--in-range:not([aria-disabled=true]):hover {
          border-radius:0!important;
          color:#fff!important;
          background-color:#0f7bab!important;
        }
        .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), 
        .react-datepicker__month-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), 
        .react-datepicker__quarter-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), 
        .react-datepicker__year-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range) {
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
          background-color:rgba(59, 130, 246, 0.2);
          color: #000;
        }
        .react-datepicker__day--range-end.react-datepicker__day--in-range {
          background-color: #0f7bab !important;
          color: white !important;
          margin:0;
          border-radius:50%;
        }
        .react-datepicker__navigation--next {
          color:black!important;
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
          pac-container {
    z-index: 1050 !important;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    margin-top: 2px;
    width: 30% !important; /* Increased from 20% to 30% */
    min-width: 300px !important; /* Added minimum width */
  }
  
  .pac-item {
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
  }
      `}</style>
    </div>
  );
};

export default MultiSearchForm;