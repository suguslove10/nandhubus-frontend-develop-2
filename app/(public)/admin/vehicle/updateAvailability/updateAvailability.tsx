"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchVehicleUnavailableDates,
  getVendorVehiclesById,
  updateAvailability,
} from "@/app/services/data.service";
import { restrictBody } from "@/app/types/restrictdate.type";
import { toast, Toaster } from "react-hot-toast";
import { fetchAllVender, GetVendorVehiclesById } from "@/app/services/admin.service";
import { Vehicle } from "@/app/types/vehicleresponse.type";

interface Vendor {
  vendorId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  vendorCompanyName: string;
  address: string;
  totalVehicles: number;
  availableVehicles: number;
  gstNumber: string;
  policyDtoList: {
    policyId: string;
    policyDescription: string;
    policyData: {
      id: string;
      policyMessage: string;
    }[];
  }[];
}

export default function UpdateAvailability() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [vendorCompanyName,setVendorCompanyName] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<
    { fromDate: string; toDate: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleError, setVehicleError] = useState("");
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [vendorInputFocused, setVendorInputFocused] = useState(false);
  const [vendorVehicles, setVendorVehicles] = useState<Vehicle[]>([]);
const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
const [vehicleInputFocused, setVehicleInputFocused] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      const vendors = await fetchAllVender();
      setAllVendors(vendors);
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    if (vendorCompanyName && vehicleNumber) {
      fetchUnavailableDates();
    }
  }, [vendorCompanyName, vehicleNumber]);

  const fetchUnavailableDates = async () => {
    try {
      const dates = await fetchVehicleUnavailableDates(vehicleNumber, vendorCompanyName);
      setUnavailableDates(dates);
      setVehicleError("");
    } catch (error: any) {
      setVehicleError(error?.response?.data?.errors?.[0]?.message || "Invalid details");
    }
  };
  const localISO = (date: Date | null) => {
    if (!date) return "";
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, -1); // remove 'Z'
    return localISOTime;
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const restrictBodyData: restrictBody = {
        vehicleNumber,
        vendorCompanyName,
        fromDate: localISO(fromDate),
        toDate: localISO(toDate),
      };

      const response = await updateAvailability(restrictBodyData);

      toast.success("Dates updated successfully!", {
        position: "top-right",
        style: {
          background: "#0f7bab",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px",
        },
        iconTheme: {
          primary: "#0f7bab",
          secondary: "#fff",
        },
      });

      setVehicleNumber("");
      setVendorCompanyName("");
      setFromDate(null);
      setToDate(null);
      setFilteredVendors([]);

      fetchUnavailableDates();
    } catch (error) {
      toast.error("Failed to update dates.", {
        position: "top-right",
        style: {
          background: "#0f7bab",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    if (!Array.isArray(unavailableDates)) return false;

    return unavailableDates.some(({ fromDate, toDate }) => {
      const from = new Date(fromDate).setHours(0, 0, 0, 0);
      const to = new Date(toDate).setHours(23, 59, 59, 999);
      const checkDate = date.setHours(0, 0, 0, 0);

      return checkDate >= from && checkDate <= to;
    });
  };

  const isWithinDateRange = (date: Date) => {
    if (!fromDate || !toDate) return true;
    return date >= fromDate && date <= toDate;
  };


  
  const isDateSelectionDisabled = !vendorCompanyName || !vehicleNumber || !!vehicleError;
  
const [vendorError,setVendorError]=useState<string>('')
  const handleVendorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVendorCompanyName(value);
    setSelectedVendorId(null); // Clear the selected vendor if user is typing manually
   setVendorError("")
    if (value.length >= 1) {
      const filtered = allVendors.filter((vendor) =>
        vendor.vendorCompanyName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVendors(filtered);
    } else {
      setFilteredVendors([]);
    }
  };
  const handleVendorSelect = async (vendor: Vendor) => {
    setVendorCompanyName(vendor.vendorCompanyName);
    setSelectedVendorId(vendor.vendorId);
    setFilteredVendors([]);
  
    try {
      const vehicleResponse = await getVendorVehiclesById(vendor.vendorId);
      const vehicles = vehicleResponse || [];
      setVendorVehicles(vehicles);
  
      if (vehicles.length === 1) {
        setVehicleNumber(vehicles[0].vehicleNumber); // directly set the only available vehicle
      } else {
        setVehicleNumber(""); // clear previous vehicleNumber
      }
    } catch (error:any) {
      setVendorVehicles([]);
      setVendorError(error?.response?.data?.errors?.[0]?.message || "Unable to fetch vendor vehicles")
    }
  };
  
  const vehicleNumbers = vendorVehicles.map(vehicle => vehicle.vehicleNumber);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const isvehiclesDisabled=!vendorCompanyName || !!vendorError;
  

  return (
    <div className="min-h-screen flex  justify-center bg-gray-50 px-4 py-8 overflow-hidden">
      <Toaster />
      <div className="w-full max-w-lg h-full bg-white p-6 md:p-8 rounded-lg shadow-lg relative mt-[3rem]">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6">
          Update Booking
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4 md:space-y-6">
          {/* Vendor Name with Autocomplete */}
          <div className="relative">
            <Label htmlFor="vendorCompanyName" className="block text-sm font-medium text-gray-600 mb-1">
              Vendor Name
            </Label>
            <Input
  id="vendorCompanyName"
  type="text"
  autoComplete="off"
  value={vendorCompanyName}
  onChange={handleVendorInput}
  onFocus={() => {
    setVendorInputFocused(true);
    // Show all vendors when focused (or filter based on current input)
    if (vendorCompanyName.length > 0) {
      const filtered = allVendors.filter(vendor =>
        vendor.vendorCompanyName.toLowerCase().includes(vendorCompanyName.toLowerCase())
      );
      setFilteredVendors(filtered);
    } else {
      setFilteredVendors(allVendors); // Show all vendors when empty and focused
    }
  }}
  onBlur={() => setTimeout(() => setVendorInputFocused(false), 150)}
  placeholder="Search by company name"
  required
  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
{vendorInputFocused && filteredVendors.length > 0 && (
  <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
    {filteredVendors.map((vendor) => (
      <li
        key={vendor.vendorId}
        onMouseDown={() => handleVendorSelect(vendor)}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
      >
        {vendor.vendorCompanyName}
      </li>
    ))}
  </ul>
)}
          </div>

          {/* Vehicle Number */}
          <div className="relative">
  <Label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-600 mb-1">
    Vehicle Number
  </Label>
  <Input
    id="vehicleNumber"
    type="text"
    value={vehicleNumber}
    autoComplete="off"
    onChange={(e) => setVehicleNumber(e.target.value)}
    onFocus={() => setVehicleInputFocused(true)}
    onBlur={() => setTimeout(() => setVehicleInputFocused(false), 150)} // delay so onMouseDown triggers
    placeholder="Enter or select vehicle number"
    disabled={isvehiclesDisabled}
    required
    className={`w-full p-2 rounded-md focus:ring-blue-500 ${
      isvehiclesDisabled
        ? 'bg-gray-100 cursor-not-allowed border-gray-200'
        : 'border border-gray-300 focus:outline-none focus:ring-2'
    }`}
  />
  {vehicleInputFocused && vendorVehicles.length > 0 && (
    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
      {vendorVehicles
        .filter((vehicle) =>
          vehicle.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
        )
        .map((vehicle, index) => (
          <li
            key={index}
            onMouseDown={() => setVehicleNumber(vehicle.vehicleNumber)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
          >
            {vehicle.vehicleNumber}
          </li>
        ))}
    </ul>
  )}
  {vehicleError && <p className="text-red-500 text-xs mt-1">{vehicleError}</p>}
</div>


          {/* Date Pickers */}
         {/* Date Pickers */}
<div className="flex flex-col md:flex-row justify-between gap-4">
  <div className="w-full flex  md:w-full">
  <div className="w-full md:w-1/2">
  <Label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">
    Start Date & Time
  </Label>
  <DatePicker
    selected={fromDate}
    onChange={(date) => setFromDate(date)}
    minDate={new Date()}
    filterDate={(date) => !isDateUnavailable(date)}
    showTimeSelect
    timeIntervals={60} // change to 15, 60, etc. if needed
    timeCaption="Time"
    dateFormat="yyyy-MM-dd h:mm aa"
    placeholderText="Select start date & time"
    disabled={isDateSelectionDisabled}
    className={`w-full p-2 border rounded-md focus:outline-none text-sm focus:ring-2 ${
      isDateSelectionDisabled  ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:ring-blue-500'
    }`}
  />
</div>

<div className="w-full md:w-1/2">
  <Label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">
    End Date & Time
  </Label>
  <DatePicker
    selected={toDate}
    onChange={(date) => setToDate(date)}
    minDate={fromDate || new Date()}
    filterDate={(date) => !isDateUnavailable(date)}
    showTimeSelect
    timeIntervals={60}
    timeCaption="Time"
    dateFormat="yyyy-MM-dd h:mm aa"
    placeholderText="Select end date & time"
    disabled={isDateSelectionDisabled}
    minTime={
      fromDate && toDate && 
      fromDate.getDate() === toDate.getDate() && 
      fromDate.getMonth() === toDate.getMonth() && 
      fromDate.getFullYear() === toDate.getFullYear()
        ? new Date(new Date(fromDate).setHours(fromDate.getHours(), fromDate.getMinutes() + 1))
        : new Date(new Date().setHours(0, 0, 0, 0))
    }
    maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
    className={`w-full p-2 border rounded-md focus:outline-none text-sm focus:ring-2 ${
      isDateSelectionDisabled ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:ring-blue-500'
    }`}
  />
</div>
</div>
</div>


          {/* Update Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#0f7bab] text-white rounded-lg shadow-md hover:bg-[#01374e] focus:outline-none focus:ring-2 focus:ring-[#01374e] transition-colors"
            >
              {isLoading ? "Updating..." : "Update Dates"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
