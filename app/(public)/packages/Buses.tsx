"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import List from "./List";
import MultiSearchForm from "./MultiSearchForm";
import { clearPackageVehicles, fetchPackageVehicles } from "@/app/Redux/packagevehcleslice";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { toDate } from "date-fns";
import { ApiError } from "next/dist/server/api-utils";

const Buses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const days = searchParams.get("days");
const sourceLatitude = searchParams.get("sourceLatitude");
const sourceLongitude = searchParams.get("sourceLongitude");
  const from = searchParams.get('source');
  const to = searchParams.get('destination');
  const start = searchParams.get('fromDate');
  const end = searchParams.get('toDate');
 const isReshedule=searchParams.get('isReschedule');
 const packageName = decodeURIComponent(searchParams.get("packageName") || "");
  // Extract source and destination from packageName on mount
  useEffect(() => {
    if (packageName) {
      const parts = packageName.split(' to ');
      if (parts.length === 2) {
        setSource(parts[0]);
        setDestination(parts[1]);
      }
    }
  }, [packageName]);


  
  const toLocalDateOnly = (isoDateStr: string | null): Date | null => {
    if (!isoDateStr) return null;
    const date = new Date(isoDateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  
  const parsedStartDate = toLocalDateOnly(start);
  const parsedEndDate = toLocalDateOnly(end);
  
  // Get state from Redux store
  const { vehicles: list, loading, error } = useSelector((state: RootState) => state.packageVehicles);
  const [source, setSource] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  const formatDateTime = (date: Date): string => {
    const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    return iso.split('.')[0];
  };

  // Get tomorrow's date as default if no date is provided
  const getTomorrowDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateTime(tomorrow);
  };
const [apiError, setApiError] = useState<Error | null>(null);
  const fetchVehicleList = async (
    fromDate: string, 
    packageTitle: string, 
    source: string, 
    sourceLatitude: number, 
    sourceLongitude: number
  ) => {
    try {
      // Get the current session storage data first to preserve end date if it exists
      setApiError(null); 
      const existingData = sessionStorage.getItem("package_form__data");
      let endDate = null;
         dispatch(clearPackageVehicles()); 
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);
          if (parsed.toDate) {
            endDate = parsed.toDate;
          }
        } catch (e) {
        }
      }
      
      // Enhanced package form data while maintaining original structure
      const packageFormData = {
        fromDate: fromDate,
        packageTitle: packageTitle,
        source: source,
        sourceLatitude: sourceLatitude,
        sourceLongitude: sourceLongitude,
        toDate: endDate, // Preserve the end date
        endDateManuallySet: sessionStorage.getItem('endDateManuallySet') === 'true'
      };
      
      // Original session storage set
      sessionStorage.setItem("package_form__data", JSON.stringify(packageFormData));
  
      // Original dispatch call remains unchanged
      const isReschedule = searchParams.get("isReschedule") === "true";
      const bookingId = searchParams.get("bookingId");
      
      await dispatch(fetchPackageVehicles({
        fromDate,
        packageName: packageTitle,
        source: source,
        sourceLatitude: sourceLatitude,
        sourceLongitude: sourceLongitude,
        ...(isReschedule && { 
          isReschedule: true,
          bookingId: bookingId || undefined
        })
      }));
  
      // Original state update
      if (list.length > 0) {
        setSource(list[0].source);
        setDestination(list[0].destination);
        
        // Optional: Update session storage with API response data
        // const updatedData = {
        //   ...packageFormData,
        //   toDate:endDate,
        //   source: list[0].source,
        //   destination: list[0].destination
        // };
        // sessionStorage.setItem("package_form__data", JSON.stringify(updatedData));
        // console.log("Updated Session Data with API response:", updatedData);
      }
    } catch (error:any) {
    // Handle different error cases
    if (error.response?.status === 404) {
      setApiError(new Error('No vehicles available for your search criteria'));
    } else if (error.message === 'No vehicles available for the selected criteria') {
      setApiError(error);
    } else if (error.message) {
      setApiError(new Error(error.message));
    } else {
      setApiError(new Error('Failed to fetch vehicles. Please try again.'));
    }
    
    // Ensure vehicles list is cleared in case of error
    dispatch(clearPackageVehicles());
  } 
  };
  
  
  useEffect(() => {
    if (list.length > 0) {
      setSource(list[0].source);
      setDestination(list[0].destination);
    }
  }, [list]);
  useEffect(() => {
    const fetchInitialData = async () => {
      let data;
      // Try to get data from sessionStorage first
      const sessionData = sessionStorage.getItem("package_form__data");
      if (sessionData) {
        data = JSON.parse(sessionData);
        
        // If we have end date in session storage, use it to initialize state
        if (data.toDate) {
          setCurrentToDate(new Date(data.toDate));
      
        }
      } else if (packageName && isReshedule !== "true") {
        // Fallback to URL params if session data doesn't exist
        data = {
          fromDate: currentFromDate.toISOString(),
          toDate: currentToDate.toISOString(),
          packageTitle: packageName,
          source: from || source || "",
          sourceLatitude: Number(sourceLatitude),
          sourceLongitude: Number(sourceLongitude),
        };
        
        sessionStorage.setItem("package_form__data", JSON.stringify(data));
      }
  
      if (data) {
        await fetchVehicleList(
          formatDateTime(new Date(data.fromDate)),
          data.packageTitle,
          data.source,
          Number(data.sourceLatitude),
          Number(data.sourceLongitude)
        );
      }
    };
  
    fetchInitialData();
  
    return () => {
      dispatch(clearPackageVehicles());
    };
  }, []);
  // Removed parsedStartDate
  const parseDateWithTime = (isoDateStr: string | null): Date | null => {
    if (!isoDateStr) return null;
    return new Date(isoDateStr);
  };

  // Initialize the fromDate state with the parsed start date from URL or tomorrow's date
  const fromDate = searchParams.get('fromDate');
  const endDate = searchParams.get('toDate');
  
  // Initialize the toDate state with the parsed end date from URL or calculate based on days
  const [currentToDate, setCurrentToDate] = useState<Date>(() => {
    return endDate ? parseDateWithTime(endDate) || new Date() : new Date();
  });
  
  
  // // Update end date when fromDate or days changes
  // useEffect(() => {
  //   if (days) {
  //     const calculatedToDate = new Date(fromDate);
  //     calculatedToDate.setDate(fromDate.getDate() + Number(days));
  //     setToDate(calculatedToDate);
  //   }
  // }, [fromDate, days]);

  const [currentFromDate, setCurrentFromDate] = useState<Date>(() => {
    return fromDate ? new Date(fromDate) : new Date();
  });
  
  // In Buses component
  const handleDateChange = (from: Date, to: Date) => {
    setCurrentFromDate(from);
    
    // Always use the provided end date (from manual selection)
    setCurrentToDate(to);
    
    // Mark that we have a manually set end date
    if (to) {
      sessionStorage.setItem('endDateManuallySet', 'true');
    }
    
    // Store these values in session storage
    const packageData = sessionStorage.getItem("package_form__data");
    if (packageData) {
      try {
        const parsedData = JSON.parse(packageData);
        parsedData.fromDate = from.toISOString();
        parsedData.toDate = to.toISOString();
        sessionStorage.setItem("package_form__data", JSON.stringify(parsedData));
      } catch (e) {
      }
    }
  };
  

  return (
    <div>
      <section>
      <MultiSearchForm
  source={source || from || ""}
  drop={destination || to || ""}
  days={Number(days) || 0}
  packageName={packageName ?? ""}
  fetchVehicleList={fetchVehicleList}
  onDateChange={handleDateChange}
  InitialFromDate={currentFromDate}
  InitialEndDate={currentToDate}
/>

      </section>
      
      <section className="p-0">
      <List
  vehicles={list}
  loading={loading}
  fromDate={currentFromDate}
  toDate={currentToDate}
  source={source ?? ""}
  destination={destination ?? ""}
  error={apiError}
/>

      </section>
    </div>
  );
};

export default Buses;