"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  ChevronRight,
  ChevronLeft,
  Filter,
} from "lucide-react";
import { ExcludedPlace, PackageVehicleList } from "../../types/package.list";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "@/app/Redux/authSlice";
import LoginModal from "@/components/login-modal/loginmodal";
import PackageFilter from "@/components/filter/packageFilter";
import Image from "next/image";
import FilterComponent from "../mobilefilter/FilterComponent";
import Swal from "sweetalert2";
import { PriceBreakDown } from "@/app/types/list.response";
import { confirmReschedule, useRescheduleBooking } from "@/app/services/data.service";
import { useLoader } from "@/app/context/LoaderContext";

interface ListProps {
  vehicles: PackageVehicleList[];
  fromDate: Date;
  toDate: Date;
  source: string;
  destination: string;
  loading?: boolean;
  error?: Error | null;
}

interface VehicleVariant {
  vehicleAC: string;
  priceDifference?: number;
}

interface PlaceOption {
  place: string;
  price: number;
}

interface Vehicle {
  vehicleId: string;
  advanceAmountNeedToPay: number;
  totalAmount: number;
  variants?: VehicleVariant[];
  excludedPlaces?: PlaceOption[];
}

const List: React.FC<ListProps> = ({
  vehicles,
  fromDate,
  toDate,
  source,
  destination,
  loading,
    error,
}) => {
  const [openTabs, setOpenTabs] = useState<Record<string, "policies" | "amenities" | null>>({});

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(
    null
  );
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedAC, setSelectedAC] = useState<{
    [key: string]: string | null;
  }>({});

  const [selectedPlaces, setSelectedPlaces] = useState<{
    [key: string]: string[];
  }>({});

  const initializeAC = (vehicleId: string, variants: any[]) => {
    if (variants?.length === 1 && !selectedAC[vehicleId]) {
      setSelectedAC((prev) => ({
        ...prev,
        [vehicleId]: variants[0].vehicleAC,
      }));
    } else if (variants?.length > 1 && !selectedAC[vehicleId]) {
      setSelectedAC((prev) => ({
        ...prev,
        [vehicleId]: "Non-A/C",
      }));
    }
  };

  useEffect(() => {
    vehicles.forEach((vehicle) => {
      initializeAC(vehicle?.vehicleId, vehicle.variants);
    });
  }, [vehicles]);

  const handleCheckboxChange = (
    vehicleId: string,
    place: ExcludedPlace,
    isChecked: boolean
  ) => {
    const price = place.price;

    setSelectedPlaces((prev) => {
      const currentPlaces = prev[vehicleId] || [];
      const updated = isChecked
        ? [...currentPlaces, place.place]
        : currentPlaces.filter((p) => p !== place.place);
      return { ...prev, [vehicleId]: updated };
    });
  };
  const handleACSelection = (
    vehicleId: string,
    acType: string,
    variants: VehicleVariant[]
  ) => {
    // First, update the selected AC in state
    setSelectedAC((prev) => ({
      ...prev,
      [vehicleId]: acType,
    }));
  
    // Find the selected variant to get price difference
    const selectedVariant = variants.find((v) => v.vehicleAC === acType);
    const priceDiff = selectedVariant?.priceDifference || 0;
  
    // Update the vehicle with new total and advance amounts
    setVehicle((prevVehicles) =>
      prevVehicles.map((vehicle) => {
        if (vehicle.vehicleId === vehicleId) {
          // Get base total without any AC variant price difference
          const baseTotal = vehicle.totalAmount;
          
          // Remove any previous AC variant price difference that might have been added
          // (assuming original vehicle.totalAmount doesn't include any variant price)
          
          // Add the new AC variant price difference
          const newTotal = baseTotal + priceDiff;
          
          // Calculate the new advance amount (reusing your calculation logic)
          let newAdvanceAmount = vehicle.advanceAmountNeedToPay;
          if (priceDiff) {
            newAdvanceAmount += priceDiff;
          }
          
          // Add excluded places costs if any are selected
          const selectedPlaceNames = selectedPlaces[vehicleId] || [];
          selectedPlaceNames.forEach((placeName) => {
            const place = vehicle.excludedPlaces?.find((p) => p.place === placeName);
            if (place) {
              newAdvanceAmount += place.price;
            }
          });
  
          return {
            ...vehicle,
            totalAmount: newTotal,
            advanceAmountNeedToPay: newAdvanceAmount,
          };
        }
        return vehicle;
      })
    );
  };
    const rescheduleBookingMutation = useRescheduleBooking();
  

    const handleReschedule = (busDetails: {
      vehicleNumbers: string[];
      price: number;
      vehicleAC: string;
      sleeper: string;
      vehicleName: string;
      totalAmount: number;
      advanceAmt: number;
      remainingAmt: number;
      abcd:number;
      advanceAmountNeedToPay: number;
      previousAdvanceAmountPaid: number;
      packagePlaces: string;
      paymentType: string;
    
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
    
        const storedData = sessionStorage.getItem("package_form__data");
        const packageFormData = storedData ? JSON.parse(storedData) : null;
        const fromDatess = packageFormData?.fromDate;
    
        const formatDate = (dateInput: Date | string) => {
          const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
          
          const pad = (num: number) => num.toString().padStart(2, '0');
          
          const year = date.getFullYear();
          const month = pad(date.getMonth() + 1);
          const day = pad(date.getDate());
          const hours = pad(date.getHours());
          const minutes = pad(date.getMinutes());
          const seconds = pad(date.getSeconds());
        
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };
    
        const requestBody = {
          bookingId,
          newStartDate: formatDate(fromDatess),
          newEndDate: formatDate(toDate),
          totalAmount: busDetails.totalAmount.toString(), 
          packagePlaces: busDetails.packagePlaces || null,
          rescheduleVehicleRequests: busDetails.vehicleNumbers.map((vehicleNumber) => ({
            vehicleNumber,
            priceBreakDown: {
              gst: 0.0,
              basicFare: busDetails.abcd ?? 0,
              tollCharges: 0,
              tollDetails: {},
              totalAmount: busDetails.abcd ?? 0,
              platFormFees: busDetails.abcd * 0.1,
              taxResponses: null,
              driverCharges: 0,
              gstOnPlatformFees: (busDetails.abcd * 0.1) * 0.18,
              vendorAmount: (busDetails.totalAmount ?? 0) -
                            ((busDetails.abcd * 0.1) + ((busDetails.abcd * 0.1) * 0.18)),
            }
            
            
            
          })),
        };
        
    
        if (busDetails.advanceAmountNeedToPay > 0) {
          sessionStorage.setItem("rescheduleData", JSON.stringify(requestBody));
    
          const formattedAdditionalAmount = busDetails.advanceAmountNeedToPay.toFixed(2);
          
    
          router.push(
            `/summary?amount=${formattedAdditionalAmount}&bookingId=${bookingId}&source=${source}&destination=${destination}&fromDate=${fromDatess}&toDate=${toDate}&vehicleNumber=${busDetails.vehicleNumbers}&totalAmount=${busDetails.totalAmount}&advanceAmt=${busDetails.advanceAmt}&remainingAmt=${busDetails.remainingAmt}&advanceAmountNeedToPay=${busDetails.advanceAmountNeedToPay}&previousAdvanceAmountPaid=${busDetails.previousAdvanceAmountPaid}&vehicleAC=${busDetails.vehicleAC}&sleeper=${busDetails.sleeper}&vehicleName=${busDetails.vehicleName}&tripSource=${tripSource}&tripDestination=${tripDestination}&additionalAmountRequired=${busDetails.advanceAmountNeedToPay}&isReschedule=true&packagePlaces=${encodeURIComponent(busDetails.packagePlaces)}&paymentType=${encodeURIComponent(busDetails.paymentType)}`
          );
        } else {
          rescheduleBookingMutation.mutate(requestBody, {
            onSuccess: (response: any) => {
              const { message, additionalAmount, additionalAmountRequired } = response;
              const formattedAdditionalAmount = additionalAmount.toFixed(2);
               confirmReschedule(bookingId);
    
              Swal.fire({
                title: "Success!",
                text: message,
                icon: "success",
                showCancelButton: additionalAmount > 0,
                showConfirmButton: additionalAmount <= 0,
                cancelButtonText: `Pay Now (₹${formattedAdditionalAmount})`,
                reverseButtons: true,
                customClass: {
                  popup: "w-80 p-4",
                  confirmButton: "px-3 py-1 text-sm",
                  cancelButton: "px-3 py-1 text-sm",
                },
              }).then((result) => {
                if (additionalAmount > 0 && result.isDismissed) {
                  router.push(
                    `/summary?amount=${formattedAdditionalAmount}&bookingId=${bookingId}&source=${source}&destination=${destination}&fromDate=${fromDatess}&toDate=${toDate}&vehicleNumber=${busDetails.vehicleNumbers}&totalAmount=${busDetails.totalAmount}&advanceAmt=${busDetails.advanceAmt}&remainingAmt=${busDetails.remainingAmt}&advanceAmountNeedToPay=${busDetails.advanceAmountNeedToPay}&previousAdvanceAmountPaid=${busDetails.previousAdvanceAmountPaid}&vehicleAC=${busDetails.vehicleAC}&sleeper=${busDetails.sleeper}&vehicleName=${busDetails.vehicleName}&tripSource=${tripSource}&tripDestination=${tripDestination}&additionalAmountRequired=${additionalAmountRequired}&packagePlaces=${encodeURIComponent(busDetails.packagePlaces)}&paymentType=${encodeURIComponent(busDetails.paymentType)}`
                  );
                } else {
                  router.push("/");
                }
              });
            },
            onError: () => {
              confirmReschedule(bookingId);

              Swal.fire({
                title: "Error!",
                text: "Something went wrong while rescheduling your booking.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                  popup: "w-80 p-4",
                  confirmButton: "px-3 py-1 text-sm",
                },
              }).then(() => {
                router.push("/");
              });
            },
          });
        }
      });
    };
    
  const getTotalAmount = (vehicle: PackageVehicleList) => {
    const acType = selectedAC[vehicle.vehicleId] ?? null;
    let totalAmount = 0;

    if (vehicle?.variants?.length > 1) {
      const selectedVariant = vehicle.variants.find(
        (variant) => variant.vehicleAC === acType
      );
      totalAmount = selectedVariant?.totalAmount ?? 0;
    } else {
      totalAmount = vehicle.totalAmount;
    }

    const places = selectedPlaces[vehicle.vehicleId] ?? [];
    totalAmount += places.reduce((sum, placeName) => {
      const place = vehicle.excludedPlaces.find(
        (excludedPlace) => excludedPlace.place === placeName
      );
      return place ? sum + place.price : sum;
    }, 0);

    return totalAmount;
  };

  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const authData = useSelector(selectAuth);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const searchParams = useSearchParams();
  
  const isAdjustTrip = searchParams.get("adjustTrip") === "true";
  const bookingId = searchParams.get("bookingId") || "";

  const fromDates = searchParams.get("fromDate") || "";
  const calculateAdvanceAmountNeedToPay = (vehicle: PackageVehicleList): number => {
    let baseAmount = vehicle.advanceAmountNeedToPay;
  
    // Add AC variant price difference (AC - Non-AC)
    const acType = selectedAC[vehicle.vehicleId];
    if (acType && vehicle.variants) {
      const selectedVariant = vehicle.variants.find(v => v.vehicleAC === acType);
      const nonAcVariant = vehicle.variants.find(v => v.vehicleAC === "Non-A/C");
      if (selectedVariant && nonAcVariant) {
        const acDifference = selectedVariant.totalAmount-nonAcVariant.totalAmount 
        baseAmount += acDifference!;
      }
    }
  
    // Add selected places prices
    const selectedPlaceNames = selectedPlaces[vehicle.vehicleId] || [];
    selectedPlaceNames.forEach(placeName => {
      const place = vehicle.excludedPlaces?.find(p => p.place === placeName);
      if (place) {
        baseAmount += place.price;
      }
    });
  
    return baseAmount;
  };
  const calculateHalfAdvanceAmountNeedToPay = (vehicle: PackageVehicleList): number => {
    let baseAmount = vehicle.advanceAmountNeedToPay;
  
    // Add AC variant price difference (AC - Non-AC)
    const acType = selectedAC[vehicle.vehicleId];
    if (acType && vehicle.variants) {
      const selectedVariant = vehicle.variants.find(v => v.vehicleAC === acType);
      const nonAcVariant = vehicle.variants.find(v => v.vehicleAC === "Non-A/C");
      if (selectedVariant && nonAcVariant) {
        const acDifference = selectedVariant.totalAmount-nonAcVariant.totalAmount 
        baseAmount += (acDifference!)/2;
      }
    }
  
    // Add selected places prices
    const selectedPlaceNames = selectedPlaces[vehicle.vehicleId] || [];
    selectedPlaceNames.forEach(placeName => {
      const place = vehicle.excludedPlaces?.find(p => p.place === placeName);
      if (place) {
        baseAmount += (place.price)/2;
      }
    });
  
    return baseAmount;
  };
  
  // Calculate total with all selected options
const calculateTotalWithOptions = (vehicle: PackageVehicleList): void => {
  let total = vehicle.totalAmount;

  // Add AC variant price difference (AC - Non-AC)
  const acType = selectedAC[vehicle.vehicleId];
  if (acType && vehicle.variants) {
    const selectedVariant = vehicle.variants.find(v => v.vehicleAC === acType);
    const nonAcVariant = vehicle.variants.find(v => v.vehicleAC?.toLowerCase() === "non-ac");

    if (selectedVariant && nonAcVariant) {
      const acDifference = selectedVariant.totalAmount - nonAcVariant.totalAmount;
      total += acDifference;
    }
  }

  // Add selected places prices
  const selectedPlaceNames = selectedPlaces[vehicle.vehicleId] || [];
  selectedPlaceNames.forEach(placeName => {
    const place = vehicle.excludedPlaces?.find(p => p.place === placeName);
    if (place) {
      total += place.price;
    }
  });

  // Update total in state
  updateVehicleTotal(vehicle.vehicleId, total);
};


const [vehicle, setVehicle] = useState<Vehicle[]>([]);
const updateVehicleTotal = (vehicleId: string, newTotal: number) => {
  setVehicle(prevVehicles => 
    prevVehicles.map(vehicle => 
      vehicle.vehicleId === vehicleId 
        ? { ...vehicle, totalAmount: newTotal } 
        : vehicle
    )
  );
};
// Format back to local time when displaying
const formatted = fromDate?.toLocaleString(); 
  const toDates = searchParams.get("toDate") || "";


  const tripSource = searchParams.get("source") || "";
  const tripDestination = searchParams.get("destination") || "";

  const handleBookNow = async (vehicle: PackageVehicleList) => {
    const acValue = selectedAC[vehicle.vehicleId];
    const sleeper = vehicle.sleeper;
  
    const totalAmount = getTotalAmount(vehicle);
  
    const policies = vehicle.policies.map((policy) => ({
      title: policy.policyDescription,
      messages: policy.policyData.map((p) => p.policyMessage),
    }));
  
    const formatLocalDate = (date: Date) => {
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 19);
    };

    const places = [
      ...(vehicle?.includedPlaces || []),
      ...(selectedPlaces[vehicle?.vehicleId] || []),
    ].join(" | ");
  

    const storedData = sessionStorage.getItem("package_form__data");
        const packageFormData = storedData ? JSON.parse(storedData) : null;
        const fromDatess = packageFormData?.fromDate;
     
    const queryParams = new URLSearchParams({
      fromDate: fromDatess,
      toDate: formatLocalDate(toDate),
      source,
      destination,
      vehicleName: vehicle.vehicleName,
      vehicleNumber: vehicle.vehicleNumber,
      acType: acValue || "",
      sleeper: sleeper,
      totalAmount: totalAmount.toString(),
      policies: encodeURIComponent(JSON.stringify(policies)),
      places: encodeURIComponent(places),
    });
  
    if (!authData.isAuthenticated) {
      sessionStorage.setItem("pendingBooking", queryParams.toString());
      setIsLoginModalOpen(true);
      return;
    }
  
    try {
      showLoader();
  
        
      await router.push(`/summary?${queryParams.toString()}`);    } catch (error) {
    } finally {
      hideLoader();
    }
  };
  
  useEffect(() => {
    if (authData.isAuthenticated) {
      const pendingBooking = sessionStorage.getItem("pendingBooking");
      if (pendingBooking) {
        sessionStorage.removeItem("pendingBooking");
        router.push(`/summary?${pendingBooking}`);
      }
    }
  }, [authData.isAuthenticated]);
  
 
  const normalize = (value: string) =>
    value.replace(/[^a-zA-Z]/g, "").toLowerCase();
  
  const filteredVehicles = Object.values(selectedFilters).some((arr) => arr.length > 0)
  ? vehicles
      .filter((bus) => {
        return Object.entries(selectedFilters).every(([filterName, selectedValues]) => {
          if (!selectedValues.length) return true;

          const normalizedSelected = selectedValues.map((v) => normalize(v));

          switch (filterName) {
            case "AC/Non-AC":
              return bus.variants?.some((variant) =>
                normalizedSelected.includes(normalize(variant.vehicleAC))
              );

            case "Seater Type":
              return normalizedSelected.includes(normalize(bus.sleeper ?? ""));

            case "Seat Capacity":
              return selectedValues.includes(String(bus.seatCapacity ?? ""));

            default:
              return true;
          }
        });
      })
      // ✅ Create a shallow copy before sorting
      .slice()
      .sort((a, b) => (a.totalAmount ?? 0) - (b.totalAmount ?? 0))
  : vehicles?.slice().sort((a, b) => (a.totalAmount ?? 0) - (b.totalAmount ?? 0));

  
  const handleClearFilters = () => {
   
    setSelectedFilters({
      "AC/Non-AC": ["Non AC"], // Reset this filter to "Non AC"
    });
  
    setSelectedAC({});

    setSelectedPlaces({});

  };
  const [activeTab, setActiveTab] = useState('main');

useEffect(() => {

  const acFilters = selectedFilters["AC/Non-AC"];
  if (!acFilters || acFilters.length === 0) return;


  vehicles.forEach(vehicle => {

    if (acFilters.length === 1) {
      const normalizedFilterValue = normalize(acFilters[0]);
      
   
      const matchingVariant = vehicle.variants.find(variant => 
        normalize(variant.vehicleAC) === normalizedFilterValue
      );
      
      if (matchingVariant) {
        setSelectedAC(prev => ({
          ...prev,
          [vehicle.vehicleId]: matchingVariant.vehicleAC
        }));
      }
    }
  });
}, [selectedFilters, vehicles]);
  return (
    <div className="flex flex-col lg:flex-row pb-[8rem] sm:pb-0">
      {/* Mobile Filter Header */}
      <div className="lg:hidden flex justify-between items-center p-4 border-b sticky top-0 bg-white ">
        <h2 className="text-lg font-semibold">Available Vehicles</h2>
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 bg-[#1C3366] text-white px-3 py-2 rounded-md text-sm"
        >
          <Filter size={16} />
          Filters
          {Object.values(selectedFilters).flat().length > 0 && (
            <span className="bg-white text-[#1C3366] rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {Object.values(selectedFilters).flat().length}
            </span>
          )}
        </button>
      </div>

    
    
{/* Left Side - Filter Component */}
<div className={`${showMobileFilters ? 'fixed inset-0 bg-white z-20 overflow-y-auto p-4' : 'hidden'} lg:block sm:w-64 lg:w-72 p-4 md:_w-142`}>
{showMobileFilters && (
  <div className="fixed inset-0 z-50 bg-white flex flex-col">
    {/* Top bar */}
   

    {/* Scrollable filter content */}

      <div className="block lg:hidden fixed inset-0 bg-white z-50">
      <FilterComponent
       setIsMobileFilterOpen={setShowMobileFilters}
       selectedFilter={selectedFilters}
       setSelectedFilter={setSelectedFilters}
          
        />
      </div>

        </div>
)}

  
{filteredVehicles.length > 0 && (
  <PackageFilter
    selectedFilters={selectedFilters}
    setSelectedFilters={setSelectedFilters}
    onApplyFilters={() => setShowMobileFilters(false)}
  />
)}

      </div>
  
      {/* Right Side - Vehicle Listing */}
      <div className="flex-1 p-2 sm:p-0">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="max-w-6xl mx-auto border shadow p-4 my-6 flex flex-col sm:flex-row gap-4 animate-pulse"
              >
                <div className="w-full sm:w-52 h-52 bg-gray-300 rounded-lg" />
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-6 bg-gray-300 w-1/3 rounded" />
                  <div className="h-4 bg-gray-200 w-1/4 rounded" />
                  <div className="h-4 bg-gray-200 w-1/2 rounded" />
                  <div className="flex gap-4 mt-3">
                    <div className="h-8 w-20 bg-gray-300 rounded-full" />
                    <div className="h-8 w-20 bg-gray-300 rounded-full" />
                  </div>
                  <div className="mt-4 h-10 w-24 bg-gray-400 rounded-full self-end" />
                </div>
              </div>
            ))
            : filteredVehicles.length === 0 || error? (
              <div className="flex flex-col items-center justify-center h-screen">
                <Image
                  src="/assests/no_bus_avail.png"
                  alt="No buses available"
                  width={500}
                  height={500}
                  priority
                />
                 <h2 className="text-xl font-bold text-gray-800 mb-2">No Buses Available</h2>
        <p className="text-gray-600 mb-6 p-1 md:p-0">
          We couldn't find any buses matching your location or date. Please try adjusting your search or check back later.
        </p>
              </div>
            ) : (filteredVehicles.map((vehicle, vIndex) => {
              const totalAmount = getTotalAmount(vehicle);
              const maxAmenitiesToShow = 4;

              const amenitiesToShow = vehicle.amenities.slice(
                0,
                maxAmenitiesToShow
              );

              const remainingAmenitiesCount =
                vehicle.amenities.length - maxAmenitiesToShow;
              const images = vehicle?.s3ImageUrl ?? [];
              const firstImage = images[0]?.vehicleImageUrl;
    
              return (
                <div key={vehicle.vehicleId}   className="max-w-6xl mx-auto border shadow p-4 my-6  sm:flex-row gap-4">
                <div
                  key={vehicle.vehicleId}
                  className="  flex flex-col sm:flex-row gap-4"
                >
                  {/* Left Side Image */}
                  {firstImage ? (
  <div
  className="relative w-full sm:w-[220px] h-[350px] sm:h-[230px] bg-gray-200 overflow-hidden cursor-pointer rounded-lg"
    onClick={() => {
      setSelectedImageIndex(0);
      setActiveVehicleId(vehicle.vehicleId);
   
    }}
  >
    <Image
      src={firstImage}
      alt="Vehicle"
      fill
      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
      placeholder="blur"
      sizes="(max-width: 640px) 100vw, 220px"

      blurDataURL={firstImage}
    />

    {vehicle?.s3ImageUrl?.length > 1 && (
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-sm">
        +{vehicle.s3ImageUrl.length - 1} Photos
      </div>
    )}
  </div>
) : (
  <div className="w-full sm:w-52 h-52 flex-shrink-0 rounded-lg flex justify-center items-center bg-gray-200" >
    No Image 
    </div>
)}

                  {/* Right Side Info */}
                  <div className="flex-1 flex flex-col gap-1 justify-start">
                    {/* Vehicle Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex flex-col gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {vehicle.vehicleName}
                        </h2>
                        <p className="text-gray-700 text-xs font-[500]">
                          {vehicle?.variants?.length > 1 ? (
                            <>
                              <span>
                                {vehicle.variants.map((v) => v.vehicleAC).join(" | ")}
                              </span> |{" "}
                              <span>{vehicle.sleeper}</span>
                            </>
                          ) : (
                            <>
                               <span>{vehicle?.variants?.[0]?.vehicleAC ?? "N/A"}</span> |{" "}
                              <span>{vehicle.sleeper}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        {/* <p className="text-base sm:text-lg font-semibold">₹ {totalAmount}</p> */}
                {isAdjustTrip ? (
        <div className="flex flex-col">
          <div>
            <span className="line-through text-gray-500 text-[14px]">
              ₹{
                selectedAC[vehicle.vehicleId] || selectedPlaces[vehicle.vehicleId]?.length > 0
                  ? totalAmount
                  : vehicle.totalAmount
              }
            </span>
            <span className="ml-2 font-semibold text-[14px]">
              ₹{vehicle.advanceAmt}
            </span>
          </div>
          {vehicle.paymentType === 'half' ? (
            <div className="text-[16px] font-semibold mt-1">
              Pay ₹{
               calculateHalfAdvanceAmountNeedToPay(vehicle)
              }
            </div>
          ) : (
            <div className="text-[16px] font-semibold mt-1">
              Pay ₹{calculateAdvanceAmountNeedToPay(vehicle)}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            ₹ {totalAmount}
          </span>
        </div>
      )}
                      </div>
                    </div>
    
                    {/* AC Selection */}
                    {vehicle?.variants?.length > 1 && (
                      <div className="my-2 flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-xs font-semibold text-gray-400">
                          Select AC Type
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-10 sm:px-4">
                          {vehicle.variants.map((variant) => (
                            <label
                              key={variant.vehicleAC}
                              className="flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`ac-type-${vehicle.vehicleId}`}
                                checked={
                                  selectedAC[vehicle.vehicleId] === variant.vehicleAC
                                }
                                onChange={() => {
                                  handleACSelection(
                                    vehicle.vehicleId,
                                    variant.vehicleAC,
                                    vehicle.variants
                                  );
                               
                                    calculateTotalWithOptions(vehicle);
                             
                                }}
                                className="accent-[#0f7bab] cursor-pointer peace"
                              />
                              {variant.vehicleAC}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  <div>
       
      </div>     
    
    <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700 gap-4">
  {/* Left Side - Included & Excluded Places */}
  <div className="flex flex-col gap-2.5 flex-1">
    <div className="text-xs text-gray-500">
      <span className="font-semibold">Places included:</span>{" "}
      <span className="text-green-700 font-semibold">
        {[...(vehicle?.includedPlaces || []), ...(selectedPlaces[vehicle?.vehicleId] || [])].join(" | ")}
      </span>
    </div>

    {vehicle?.excludedPlaces?.length > 0 && (
      <div className="flex flex-col gap-2.5 text-xs">
        <span className="text-gray-600 font-semibold">You may also include</span>
        {vehicle.excludedPlaces.map((place) => (
          <label
            key={place.place}
            className="flex items-center gap-2 text-xs text-gray-700"
          >
            <input
              type="checkbox"
              onChange={(e) => {
                handleCheckboxChange(
                  vehicle.vehicleId,
                  place,
                  e.target.checked
                );
                // Recalculate total when places change
                if (isAdjustTrip) {
                  calculateTotalWithOptions(vehicle);
                }
              }}
              className="accent-[#0f7bab] cursor-pointer peace"
            />
            <span>{place.place}</span>
            <span className="text-gray-500">( + ₹{place.price})</span>
          </label>
        ))}
      </div>
    )}
     <div className=" flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible">
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
  

{/* Right Side - Column layout */}
<div className="flex flex-col items-end justify-between gap-2 min-w-[130px] text-right">
  {/* Price */}
  
  {/* Seater Info */}
  <p className="text-gray-700 text-xs font-[500]">
    {vehicle.seatCapacity} Seater
  </p>

  {/* Mobile layout - policies and book now in a row */}
  <div className="md:hidden flex items-center justify-between w-full">
    {/* Policies section - mobile only */}
    <div className="flex gap-4 top-[20px]">
      {["policies"].map((tab) => (
        <button
          key={tab}
          onClick={() =>
            setOpenTabs(prev => ({
              ...prev,
              [vehicle.vehicleId]: openTabs[vehicle.vehicleId] === tab ? null : tab as any
            }))
          }
          className={`capitalize flex items-center gap-1 px-2 text-sm py-1 underline text-[#01374e] font-medium rounded-md ${
            openTabs[vehicle.vehicleId] === tab
              ? "text-[#01374e]font-medium cursor-pointer underline"
              : "text-[#01374e] cursor-pointer"
          }`}
        >
          {tab}
          {openTabs[vehicle.vehicleId] === tab ? (
            <ChevronUp size={14} className="cursor-pointer" />
          ) : (
            <ChevronDown size={14} className="cursor-pointer" />
          )}
        </button>
      ))}
    </div>
    
    {/* Book Now / Reschedule - moved to the right in mobile */}
    <button
        className="bg-[#1C3366] hover:bg-[#162954] text-white text-xs sm:text-sm font-medium px-4 py-2 sm:py-1.5 rounded-md cursor-pointer"
        onClick={() => {
          const selectedPlacesForVehicle = selectedPlaces[vehicle.vehicleId] || [];
          const packagePlaces = [...(vehicle?.includedPlaces || []), ...selectedPlacesForVehicle].join(",");
          
          let amountToPay;
          if (isAdjustTrip) {
            if (vehicle.paymentType === 'half') {
              amountToPay = calculateHalfAdvanceAmountNeedToPay(vehicle);
            } else {
              amountToPay = calculateAdvanceAmountNeedToPay(vehicle);
            }

    
            handleReschedule({
              vehicleNumbers: [vehicle.vehicleNumber],
              price: vehicle.totalAmount,
              vehicleAC: selectedAC[vehicle.vehicleId] || vehicle?.variants?.[0]?.vehicleAC || "N/A",
              sleeper: vehicle.sleeper,
              vehicleName: vehicle.vehicleName,
              totalAmount:totalAmount ,
              advanceAmt: vehicle.advanceAmt,
              remainingAmt: vehicle.remainingAmt,
              abcd:vehicle.totalAmount,
              advanceAmountNeedToPay: amountToPay,
              previousAdvanceAmountPaid: vehicle.previousAdvanceAmountPaid,
              packagePlaces: packagePlaces,
              paymentType: vehicle.paymentType
            });
          } else {
            handleBookNow(vehicle);
          }
        }}
      >
        {isAdjustTrip ? "Reschedule" : "Book Now"}
      </button>
  </div>

  {/* Desktop layout - book now button only */}
  <button
      className="hidden md:block bg-[#1C3366] hover:bg-[#162954] text-white text-xs sm:text-sm font-medium px-4 py-2 sm:py-1.5 rounded-md cursor-pointer"
      onClick={() => {
        const selectedPlacesForVehicle = selectedPlaces[vehicle.vehicleId] || [];
        const packagePlaces = [...(vehicle?.includedPlaces || []), ...selectedPlacesForVehicle].join(",");
        
        let amountToPay;
        if (isAdjustTrip) {
          if (vehicle.paymentType === 'half') {
            amountToPay = calculateHalfAdvanceAmountNeedToPay(vehicle);
          } else {
            amountToPay = calculateAdvanceAmountNeedToPay(vehicle);
          }
  
          handleReschedule({
            vehicleNumbers: [vehicle.vehicleNumber],
            price: vehicle.totalAmount,
            vehicleAC: selectedAC[vehicle.vehicleId] || vehicle?.variants?.[0]?.vehicleAC || "N/A",
            sleeper: vehicle.sleeper,
            vehicleName: vehicle.vehicleName,
            totalAmount: totalAmount,
            advanceAmt: vehicle.advanceAmt,
            remainingAmt: vehicle.remainingAmt,
            abcd: vehicle.totalAmount,
            advanceAmountNeedToPay: amountToPay,
            previousAdvanceAmountPaid: vehicle.previousAdvanceAmountPaid,
            packagePlaces: packagePlaces,
            paymentType: vehicle.paymentType
          });
        } else {
          handleBookNow(vehicle);
        }
      }}
    >
      {isAdjustTrip ? "Reschedule" : "Book Now"}
    </button>
</div>
</div>


    
                    {/* <div className="mt-2 text-right flex flex-col sm:flex-row justify-between border-t pt-3 border-t-gray-200 gap-3">
                      <div className="flex gap-4 justify-start">
                      {["policies"].map((tab) => (
  <button
    key={tab}
    onClick={() =>
      setOpenTabs(prev => ({
        ...prev,
        [vehicle.vehicleId]: openTabs[vehicle.vehicleId] === tab ? null : tab as any
      }))
    }
    className={`capitalize flex items-center gap-1 px-2 text-xs py-1 rounded-md ${
      openTabs[vehicle.vehicleId] === tab
        ? "text-[#0f7bab] font-semibold cursor-pointer"
        : "text-gray-700 cursor-pointer"
    }`}
  >
    {tab}
    {openTabs[vehicle.vehicleId] === tab ? (
      <ChevronUp size={14} className="cursor-pointer" />
    ) : (
      <ChevronDown size={14} className="cursor-pointer" />
    )}
  </button>
))}
                      </div>
          
                    </div>
     */}
                    {/* Conditional Tabs */}
                    {openTabs[vehicle.vehicleId] === "amenities" && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-gray-100 p-4 mt-5">
    {vehicle.amenities.map((a) => (
      <div key={a.amenityId} className="flex flex-col items-center text-sm">
        <img
          src={a.amenitiesImageUrl}
          alt={a.amenityName}
          className="w-5 h-5"
        />
        <span className="text-xs">{a.amenityName}</span>
      </div>
    ))}
  </div>
)}


                  </div>
                </div>
                <div className="flex justify-between sm:justify-end items-center mt-2">
    {/* Policies button - now on left in mobile, right in desktop */}
    <div className=" flex gap-4 sm:ml-auto">
      {["policies"].map((tab) => (
        <button
          key={tab}
          onClick={() =>
            setOpenTabs(prev => ({
              ...prev,
              [vehicle.vehicleId]: openTabs[vehicle.vehicleId] === tab ? null : tab as any
            }))
          }
          className={`capitalize md:flex items-center gap-1 px-2 text-sm py-1 underline text-[#01374e] font-medium hidden  rounded-md ${
            openTabs[vehicle.vehicleId] === tab
              ? "text-[#01374e]font-medium cursor-pointer underline"
              : "text-[#01374e] cursor-pointer"
          }`}
        >
          {tab}
          {openTabs[vehicle.vehicleId] === tab ? (
            <ChevronUp size={14} className="cursor-pointer" />
          ) : (
            <ChevronDown size={14} className="cursor-pointer" />
          )}
        </button>
      ))}
    </div>
  </div>
  
  {openTabs[vehicle.vehicleId] === "policies" && (
    <div className="grid grid-cols-1 gap-4 mt-4 text-xs bg-gray-100 p-4">
      {vehicle.policies.map((policy) => (
        <div key={policy.policyId} className="space-y-3">
          <h3 className="font-medium text-sm">
            {policy.policyDescription}
          </h3>
          <ul className="list-disc pl-5">
            {policy.policyData.map((pd) => (
              <li key={pd.id}>{pd.policyMessage}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )}
                </div>
              )
            }))}
    
        {/* Global image viewer (slider) */}
        {selectedImageIndex !== null && activeVehicleId !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="relative flex items-center">
      <button
        onClick={() => setSelectedImageIndex(null)}
        className="absolute top-4 right-4 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10"
      >
        <X size={20} />
      </button>
      
      {/* Find the active vehicle in filteredVehicles */}
      {(() => {
        const activeVehicle = filteredVehicles.find(v => v.vehicleId === activeVehicleId);
        if (!activeVehicle) return null;
        
        const images = activeVehicle.s3ImageUrl;
        return (
          <>
            <button
              onClick={() =>
                setSelectedImageIndex(
                  (selectedImageIndex - 1 + images.length) % images.length
                )
              }
              className="absolute left-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            
            <img
              src={images[selectedImageIndex].vehicleImageUrl}
              alt="active vehicle"
              className="max-w-full max-h-[90vh] rounded-xl"
            />
            
            <button
              onClick={() =>
                setSelectedImageIndex(
                  (selectedImageIndex + 1) % images.length
                )
              }
              className="absolute right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        );
      })()}
    </div>
  </div>
)}
    
        {isLoginModalOpen && (
          <LoginModal onClose={() => setIsLoginModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default List;