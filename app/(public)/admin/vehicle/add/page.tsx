"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { addVehcle } from "@/app/services/admin.service";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Upload, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Zod schema for form validation
const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, { message: "Vehicle number is required" }),
  vehicleName: z.string().min(1, { message: "Vehicle name is required" }),
  vendorNumber: z
    .string()
    .min(10, { message: "Vendor Mobile number is required" }),
  seatCapacity: z
    .number()
    .min(1, { message: "Seat capacity must be at least 1" }),
  amountPerKM: z
    .number()
    .min(0, { message: "Amount per KM must be a positive value" }),
  mileage: z.number().min(0, { message: "Mileage must be a positive value" }),
  latitude: z.string().min(1, { message: "Latitude is required" }),
  longitude: z.string().min(1, { message: "Longitude is required" }),
  // Add these to your vehicleSchema
dayDriverBata: z.number().min(0, "Day driver bata must be a positive number"),
nightDriverBata: z.number().min(0, "Night driver bata must be a positive number"),
  haltLocationAddress: z
    .string()
    .min(1, { message: "Halt location is required" }),
  isFastTagAvailable: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Please select a valid option",
    })
    .default("false"),
  busType: z.enum(["AC", "Non-AC"], { message: "Bus type is required" }),
  vehicleType: z.enum(["SS", "FS", "NS"], {
    message: "Vehicle type is required",
  }),
  amenities: z
    .array(z.string())
    .min(1, { message: "At least one option must be selected" }),
  images: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith("image/"),
          "File must be an image"
        )
    )
    .min(5, "Please upload at least 5 images")
    .max(6, "Maximum 6 images allowed"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const VehicleForm = () => {
  const queryClient = useQueryClient();
  const [vendor, setVendor] = useState<any | null>(null);
  const [vendorError, setVendorError] = useState<string>("");
  // State to track selected amenities
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(6).fill(null)
  );
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const {
    register: vehicleRegister,
    handleSubmit: vehicleSubmit,

    formState: { errors, isSubmitting: addVehicleSubmitting },
    setValue,
    reset,
    control,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      amenities: [],
      images: [],
      busType: "AC",
      vehicleType: "SS",
      isFastTagAvailable: "false",
      dayDriverBata: 0,
      nightDriverBata: 0,
    },
  });

  // #########################  vehicle Image upload       ##############################################

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];

    newImageFiles[index] = file;
    newImagePreviews[index] = URL.createObjectURL(file);

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);

    // Update form value with non-null images
    setValue(
      "images",
      newImageFiles.filter((img): img is File => img !== null)
    );
  };

  const removeImage = (index: number): void => {
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];

    newImageFiles[index] = null;
    if (newImagePreviews[index]) {
      URL.revokeObjectURL(newImagePreviews[index] as string);
      newImagePreviews[index] = null;
    }

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
    setValue(
      "images",
      newImageFiles.filter((img): img is File => img !== null)
    );
  };

  const uploadedCount = imageFiles.filter((file) => file !== null).length;
  const primaryColor = "#0F7BAB";
  const primaryLightBg = "#E6F3F8";

  // ###########################################################################################################

  const haltLocationRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Function to handle amenity checkbox change
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        // Remove if already selected
        const updated = prev.filter((item) => item !== amenity);
        setValue("amenities", updated);
        return updated;
      } else {
        // Add if not selected
        const updated = [...prev, amenity];
        setValue("amenities", updated);
        return updated;
      }
    });
  };

  // Function to prepare the form data with correct field names
  const prepareFormData = (data: VehicleFormValues) => {
    const formData = new FormData();
    const vehicleStatus = "active";
    formData.append("registrationNumber", data.registrationNumber);
    formData.append("vehicleName", data.vehicleName);
    formData.append("vendorNumber", data.vendorNumber);
    formData.append("seatCapacity", data.seatCapacity.toString());
    formData.append("amtPerKM", data.amountPerKM.toString());
    formData.append("mileage", data.mileage.toString());
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("haltLocationAddress", data.haltLocationAddress);
    formData.append("busType", data.busType);
    formData.append("vehicleType", data.vehicleType);
    formData.append("isFastTagAvailable", data.isFastTagAvailable);
    formData.append("amenities", data.amenities.join(","));
    formData.append("vehicleStatus", vehicleStatus);
    // Add the new fields
    formData.append("dayDriverBata", data.dayDriverBata.toString());
    formData.append("nightDriverBata", data.nightDriverBata.toString());
  
    // Generate image priorities for selected images
    const priorities = imageFiles
      .map((file, index) => (file ? index + 1 : null))
      .filter((p): p is number => p !== null);
    formData.append("imagePriorities", priorities.join(","));
  
    // Append images directly
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }
  
    return formData;
  };

  // Function to handle the form submission
  const onSubmit = async (data: VehicleFormValues) => {
    const formData = prepareFormData(data);

    try {
      const response = await addVehcle(formData);
      if (response) {
        toast.success("Vehicle added successfully!");
        reset();
        setSelectedAmenities([]);
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        setImageFiles(Array(6).fill(null));
        setImagePreviews(Array(6).fill(null));
      } else {
        throw new Error("Failed to add vehicle");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handle Google Maps Autocomplete Place Change
  const handlePlaceChanged = () => {
    if (haltLocationRef.current) {
      const place = haltLocationRef.current.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setValue("latitude", lat.toString());
        setValue("longitude", lng.toString());
        const haltLocation = place.formatted_address || "";
        setValue("haltLocationAddress", haltLocation);
      }
    }
  };

  const libraries: "places"[] = ["places"];

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU"
      libraries={libraries}
      region="IN"
      loadingElement={<Skeleton className="h-8 w-full" />}
    >
 <div className="min-h-screen w-full p-4 md:p-8">
  <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 bg-white rounded-xl shadow-md">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8">
      Add Vehicle Information
    </h2>

    <form onSubmit={vehicleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
      {/* Two fields in a row - Vehicle Number and Vehicle Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Vehicle Number */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Vehicle Number
    </label>
    <input
    type="text"
    {...vehicleRegister("registrationNumber")}
    onKeyPress={(e) => {
      // Allow only alphanumeric characters, spaces, and hyphens
      if (!/^[a-zA-Z0-9\s-]*$/.test(e.key)) {
        e.preventDefault();
      }
    }}
    className={`w-full px-3 py-0.5 pb-0 focus:outline-none ${
      errors.registrationNumber
        ? "border-red-500"
        : "border-transparent"
    } focus:ring-0`}
    placeholder="Enter vehicle number"
  />
  {errors.registrationNumber && (
    <p className="text-red-500 text-xs mt-1">
      {errors.registrationNumber.message}
    </p>
  )}
  </div>
  
  {/* Vehicle Name */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Vehicle Name
    </label>
    <input
    type="text"
    {...vehicleRegister("vehicleName")}
    onKeyPress={(e) => {
      // Allow only letters, numbers, spaces, and basic punctuation
      if (!/^[a-zA-Z0-9\s.,'-]*$/.test(e.key)) {
        e.preventDefault();
      }
    }}
    className={`w-full px-3 py-0.5 pb-0 focus:outline-none ${
      errors.vehicleName ? "border-red-500" : "border-transparent"
    } focus:ring-0`}
    placeholder="Enter vehicle name"
  />
  {errors.vehicleName && (
    <p className="text-red-500 text-xs mt-1">
      {errors.vehicleName.message}
    </p>
  )}
  </div>
</div>

     {/* Vendor Number (full width) with border bottom */}
<div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Vendor Number
  </label>
  <input
    type="text"
    {...vehicleRegister("vendorNumber")}
    className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
      errors.vendorNumber ? "border-red-500" : "border-transparent"
    }`}
    placeholder="Enter mobile number"
  />
  {errors.vendorNumber && (
    <p className="text-red-500 text-xs mt-1">
      {errors.vendorNumber.message}
    </p>
  )}
  {vendor && (
    <div className="mt-2 text-green-500 text-sm">
      Vendor: {vendor.vendorCompanyName} (ID: {vendor.vendorId})
    </div>
  )}
  {vendorError && (
    <p className="text-red-500 text-xs mt-1">{vendorError}</p>
  )}
</div>

     {/* Two fields in a row - Seat Capacity and Amount Per KM */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Seat Capacity */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Seat Capacity
    </label>
    <input
      type="number"
      {...vehicleRegister("seatCapacity", { valueAsNumber: true })}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.seatCapacity ? "border-red-500" : "border-transparent"
      }`}
      placeholder="Enter seat capacity"
    />
    {errors.seatCapacity && (
      <p className="text-red-500 text-xs mt-1">
        {errors.seatCapacity.message}
      </p>
    )}
  </div>
  
  {/* Amount Per KM */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Amount Per KM
    </label>
    <input
      type="number"
      {...vehicleRegister("amountPerKM", { valueAsNumber: true })}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.amountPerKM ? "border-red-500" : "border-transparent"
      }`}
      placeholder="Enter amount per KM"
    />
    {errors.amountPerKM && (
      <p className="text-red-500 text-xs mt-1">
        {errors.amountPerKM.message}
      </p>
    )}
  </div>
</div>

{/* Two fields in a row - Mileage and Vehicle Type */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Mileage */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Mileage
    </label>
    <input
      type="number"
      {...vehicleRegister("mileage", { valueAsNumber: true })}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.mileage ? "border-red-500" : "border-transparent"
      }`}
      placeholder="Enter mileage"
    />
    {errors.mileage && (
      <p className="text-red-500 text-xs mt-1">
        {errors.mileage.message}
      </p>
    )}
  </div>
  
  {/* Vehicle Type */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Vehicle Type
    </label>
    <select
      {...vehicleRegister("vehicleType")}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.vehicleType ? "border-red-500" : "border-transparent"
      }`}
    >
      <option value="SS">Seater Sleeper (SS)</option>
      <option value="FS">Sleeper (SL)</option>
      <option value="NS">Seater (SA)</option>
    </select>
    {errors.vehicleType && (
      <p className="text-red-500 text-xs mt-1">
        {errors.vehicleType.message}
      </p>
    )}
  </div>
</div>

{/* Amenities (full width) - No border bottom */}
<div className="pb-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Amenities
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={selectedAmenities.includes("Wifi")}
        onChange={() => handleAmenityToggle("Wifi")}
        className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
      />
      <span className="text-sm">Wifi</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={selectedAmenities.includes("Charger")}
        onChange={() => handleAmenityToggle("Charger")}
        className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
      />
      <span className="text-sm">Charging Port</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={selectedAmenities.includes("TV")}
        onChange={() => handleAmenityToggle("TV")}
        className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
      />
      <span className="text-sm">TV</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={selectedAmenities.includes("CCTV")}
        onChange={() => handleAmenityToggle("CCTV")}
        className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
      />
      <span className="text-sm">CCTV</span>
    </label>
  </div>
  {errors.amenities && (
    <p className="text-red-500 text-xs mt-1">
      {errors.amenities.message}
    </p>
  )}
</div>

{/* Halt Location (full width) with border bottom */}
<div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Halt Location
  </label>
  <Autocomplete
    onLoad={(ref) => (haltLocationRef.current = ref)}
    onPlaceChanged={handlePlaceChanged}
    options={{ componentRestrictions: { country: "IN" } }}
  >
   <input
  type="text"
  {...vehicleRegister("haltLocationAddress")}
  onKeyPress={(e) => {
    // Allow letters, numbers, spaces, commas, periods, and basic punctuation
    if (!/^[a-zA-Z0-9\s.,'-]*$/.test(e.key)) {
      e.preventDefault();
    }
  }}
  className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
    errors.haltLocationAddress
      ? "border-red-500"
      : "border-transparent"
  }`}
  placeholder="Enter halt location"
/>
  </Autocomplete>
  {errors.haltLocationAddress && (
    <p className="text-red-500 text-xs mt-1">
      {errors.haltLocationAddress.message}
    </p>
  )}
</div>

{/* Two fields in a row - Latitude and Longitude */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Latitude */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Latitude
    </label>
    <input
  type="text"
  {...vehicleRegister("latitude")}
  onKeyPress={(e) => {
    // Allow numbers, decimal point, and minus sign (for negative coordinates)
    if (!/^[0-9.-]*$/.test(e.key)) {
      e.preventDefault();
    }
  }}
  onBlur={(e) => {
    // Validate latitude range (-90 to 90) on blur
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < -90 || value > 90) {
      // You might want to set an error here using your form validation
      e.target.value = '';
    }
  }}
  className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
    errors.latitude ? "border-red-500" : "border-transparent"
  }`}
  placeholder="Enter latitude"
/>

    {errors.latitude && (
      <p className="text-red-500 text-xs mt-1">
        {errors.latitude.message}
      </p>
    )}
  </div>
  
  {/* Longitude */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Longitude
    </label>
    <input
  type="text"
  {...vehicleRegister("longitude")}
  onKeyPress={(e) => {
    // Allow numbers, decimal point, and minus sign (for negative coordinates)
    if (!/^[0-9.-]*$/.test(e.key)) {
      e.preventDefault();
    }
  }}
  onBlur={(e) => {
    // Validate longitude range (-180 to 180) on blur
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < -180 || value > 180) {
      // You might want to set an error here using your form validation
      e.target.value = '';
    }
  }}
  className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
    errors.longitude ? "border-red-500" : "border-transparent"
  }`}
  placeholder="Enter longitude"
/>
    {errors.longitude && (
      <p className="text-red-500 text-xs mt-1">
        {errors.longitude.message}
      </p>
    )}
  </div>
</div>


{/* Two fields in a row - Day Driver Bata and Night Driver Bata */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Day Driver Bata */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Day Driver Bata (₹)
    </label>
    <input
      {...vehicleRegister("dayDriverBata", { valueAsNumber: true })}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.dayDriverBata ? "border-red-500" : "border-transparent"
      }`}
      placeholder="Enter day driver bata"
      min="0"
    />
    {errors.dayDriverBata && (
      <p className="text-red-500 text-xs mt-1">
        {errors.dayDriverBata.message}
      </p>
    )}
  </div>
  
  {/* Night Driver Bata */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Night Driver Bata (₹)
    </label>
    <input
      {...vehicleRegister("nightDriverBata", { valueAsNumber: true })}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.nightDriverBata ? "border-red-500" : "border-transparent"
      }`}
      placeholder="Enter night driver bata"
      min="0"
    />
    {errors.nightDriverBata && (
      <p className="text-red-500 text-xs mt-1">
        {errors.nightDriverBata.message}
      </p>
    )}
  </div>
</div>

{/* Two fields in a row - Fast Tag and Bus Type */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  {/* Fast Tag Available - No border bottom */}
  <div className="pb-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Fast Tag Available
    </label>
    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="true"
          {...vehicleRegister("isFastTagAvailable")}
          className="text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
        />
        <span className="text-sm">Yes</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="false"
          {...vehicleRegister("isFastTagAvailable")}
          className="text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
        />
        <span className="text-sm">No</span>
      </label>
    </div>
    {errors.isFastTagAvailable && (
      <p className="text-red-500 text-xs mt-1">
        {errors.isFastTagAvailable.message}
      </p>
    )}
  </div>
  
  {/* Bus Type */}
  <div className="border-b border-gray-300 focus-within:border-[#0F7BAB]">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Bus Type
    </label>
    <select
      {...vehicleRegister("busType")}
      className={`w-full px-3 py-1 pb-0 focus:outline-none focus:ring-0 ${
        errors.busType ? "border-red-500" : "border-transparent"
      }`}
    >
      <option value="AC">AC</option>
      <option value="Non-AC">Non-AC</option>
    </select>
    {errors.busType && (
      <p className="text-red-500 text-xs mt-1">
        {errors.busType.message}
      </p>
    )}
  </div>
</div>

{/* Vehicle Images (full width) - No border bottom */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <h3 className="text-md md:text-lg font-medium">Vehicle Images</h3>
    <span
      style={{
        color: uploadedCount >= 5 ? "#2F855A" : primaryColor,
      }}
      className="text-sm md:text-base"
    >
      {uploadedCount}/6 images{" "}
      {uploadedCount < 5
        ? `(${5 - uploadedCount} more required)`
        : ""}
    </span>
  </div>

  {/* Special highlight for front view */}
  <div
    style={{
      backgroundColor: imagePreviews[0]
        ? "#F0FFF4"
        : primaryLightBg,
      padding: "0.5rem",
      borderRadius: "0.375rem",
      marginBottom: "0.5rem",
    }}
  >
    <p className="text-xs md:text-sm font-medium">
      Front view image is required and will be shown first to
      customers
    </p>
  </div>

  {errors.images && (
    <p className="text-red-500 text-sm">{errors.images.message}</p>
  )}
</div>

<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
  {/* Front view image (index 0) gets special styling */}
  <div
    className="relative aspect-video rounded-lg overflow-hidden border-2"
    style={{
      borderColor: imagePreviews[0] ? "#2F855A" : primaryColor,
      borderStyle: imagePreviews[0] ? "solid" : "dashed",
    }}
  >
    {imagePreviews[0] ? (
      <>
        <img
          src={imagePreviews[0]}
          alt="Vehicle front view"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => removeImage(0)}
            className="p-1 bg-red-500 rounded-full text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          Front View
        </div>
      </>
    ) : (
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <Camera
            className="w-6 h-6 md:w-8 md:h-8"
            style={{ color: primaryColor }}
          />
          <span className="mt-1 text-xs font-medium">
            Front View (Required)
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 0)}
        />
      </label>
    )}
  </div>

  {/* Other 5 image slots */}
  {[1, 2, 3, 4, 5].map((index) => (
    <div
      key={index}
      className={`relative aspect-video rounded-lg overflow-hidden border ${
        imagePreviews[index]
          ? "border-gray-300"
          : "border-gray-300 border-dashed"
      }`}
    >
      {imagePreviews[index] ? (
        <>
          <img
            src={imagePreviews[index] as string}
            alt={`Vehicle image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-1 bg-red-500 rounded-full text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
            Image {index}
          </div>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            <span className="mt-1 text-xs text-gray-500">
              Add Image
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, index)}
          />
        </label>
      )}
    </div>
  ))}
</div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full py-2 md:py-3 bg-[#0F7BAB] text-white rounded-lg hover:bg-[#0d6d7e] focus:outline-none text-sm md:text-base"
        >
          Add Vehicle
        </button>
      </div>
    </form>
  </div>
  {addVehicleSubmitting && (
    <div className="w-full h-screen fixed top-0 left-0 bg-black/20 flex items-center justify-center z-[99999]">
      <div className="loader"></div>
    </div>
  )}
</div>
    </LoadScript>
  );
};

export default VehicleForm;
