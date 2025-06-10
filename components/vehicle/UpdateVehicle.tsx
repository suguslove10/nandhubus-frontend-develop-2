"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { updateVehicle } from "@/app/services/admin.service";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Upload, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useVehicle } from "@/app/hooks/vehicle/useVehicle";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Vehicle } from "@/app/types/vehicleType";

// Zod schema for form validation
const vehicleUpdateSchema = z.object({
  vehicleId: z.string(),
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
  amtPerKM: z
    .number()
    .min(0, { message: "Amount per KM must be a positive value" }),
  mileage: z.number().min(0, { message: "Mileage must be a positive value" }),
  latitude: z.string().min(1, { message: "Latitude is required" }),
  longitude: z.string().min(1, { message: "Longitude is required" }),
  dayDriverBata: z.number().min(0, "Day driver bata must be a positive number"),
  nightDriverBata: z.number().min(0, "Night driver bata must be a positive number"),
  haltLocationAddress: z
    .string()
    .min(1, { message: "Halt location is required" }),
  isFastTagAvailable: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Please select a valid option",
    }),
  busType: z.enum(["AC", "NA"], { message: "Bus type is required" }),
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
    .optional(),
  vehicleStatus: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Vehicle status is required",
  }),
});

type VehicleUpdateFormValues = z.infer<typeof vehicleUpdateSchema>;

const VehicleUpdateForm = ({ vehicle }: { vehicle: Vehicle }) => {
  const queryClient = useQueryClient();
  //   const { data: vehicle, isLoading } = useVehicle(id);
  const [openUp, setOpenUp] = useState(false);
  const [vendor, setVendor] = useState<any | null>(null);
  const [vendorError, setVendorError] = useState<string>("");
  // State to track selected amenities
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(6).fill(null)
  );
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<VehicleUpdateFormValues>({
    resolver: zodResolver(vehicleUpdateSchema),
    defaultValues: {
      vehicleId: "",
      registrationNumber: "",
      vehicleName: "",
      vendorNumber: "",
      seatCapacity: 0,
      amtPerKM: 0,
      mileage: 0,
      dayDriverBata: 0,
      nightDriverBata: 0,
      latitude: "",
      longitude: "",
      haltLocationAddress: "",
      isFastTagAvailable: "false",
      busType: "AC",
      vehicleType: "SS",
      amenities: [],
      vehicleStatus: "ACTIVE",
    },
  });

  const fetchCoordinates = async (address: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      setValue("latitude", location.lat.toString());
      setValue("longitude", location.lng.toString());
    } else {
      toast.error("Unable to fetch coordinates for the halt location.");
    }
  };

  // Pre-populate form with vehicle data when it loads
  useEffect(() => {
    if (vehicle) {
      // Set form values
      setValue("vehicleId", vehicle.vehicleId);
      setValue("registrationNumber", vehicle.vehicleNumber);
      setValue("vehicleName", vehicle.vehicleName);
      setValue("vendorNumber", vehicle.vendorNumber || "");
      setValue("seatCapacity", vehicle.seatCapacity);
      setValue("amtPerKM", vehicle.amtPerKM);
      setValue("mileage", vehicle.mileage);
      setValue("dayDriverBata", vehicle.dayDriverBata || 0);
      setValue("nightDriverBata", vehicle.nightDriverBata || 0);

      //   setValue("latitude", vehicle.latitude || "");
      //   setValue("longitude", vehicle.longitude || "");
      setValue("haltLocationAddress", vehicle.haltLocationAddress);
      setValue("isFastTagAvailable", "false");
      setValue("busType", vehicle.filter.split("/")[0] === "AC" ? "AC" : "NA");
      setValue(
        "vehicleType",
        vehicle.filter.split("/")[1] === "SS"
          ? "SS"
          : vehicle.filter.split("/")[1] === "FS"
          ? "FS"
          : "NS"
      );
      setValue(
        "vehicleStatus",
        vehicle.vehicleStatus === "ACTIVE" ? "ACTIVE" : "INACTIVE"
      );

      if (
        vehicle.vehicleImageDataResponses &&
        vehicle.vehicleImageDataResponses.length > 0
      ) {
        const sortedImages = [...vehicle.vehicleImageDataResponses].sort(
          (a, b) => a.vehicleImagePriority - b.vehicleImagePriority
        );

        setExistingImages(sortedImages);

        const newPreviews = Array(6).fill(null);
        sortedImages.forEach((img, index) => {
          if (index < 6) {
            newPreviews[index] = img.vehicleImageUrl;
          }
        });
        setImagePreviews(newPreviews);
      }

      // Ensure latitude and longitude are set initially
      if (vehicle.latitude && vehicle.longitude) {
        setValue("latitude", vehicle.latitude.toString());
        setValue("longitude", vehicle.longitude.toString());
      } else {
        fetchCoordinates(vehicle.haltLocationAddress);
      }

      // Set amenities
      const amenityNames = vehicle.amenitiesResponses.map((a) => a.amenityName);
      setValue("amenities", amenityNames);
      setSelectedAmenities(amenityNames);

      // Setup existing images
      if (
        vehicle.vehicleImageDataResponses &&
        vehicle.vehicleImageDataResponses.length > 0
      ) {
        const sortedImages = [...vehicle.vehicleImageDataResponses].sort(
          (a, b) => a.vehicleImagePriority - b.vehicleImagePriority
        );

        setExistingImages(sortedImages);

        // Set image previews for existing images
        const newPreviews = Array(6).fill(null);
        sortedImages.forEach((img, index) => {
          if (index < 6) {
            newPreviews[index] = img.vehicleImageUrl;
          }
        });
        setImagePreviews(newPreviews);
      }
    }
  }, [vehicle, setValue]);

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

    // If replacing an existing image, mark it for removal
    if (existingImages[index]) {
      setImagesToRemove((prev) => [
        ...prev,
        existingImages[index].vehicleImageId,
      ]);
    }

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

    // If removing an existing image, mark it for removal
    if (existingImages[index]) {
      setImagesToRemove((prev) => [
        ...prev,
        existingImages[index].vehicleImageId,
      ]);
    }

    newImageFiles[index] = null;
    if (newImagePreviews[index]) {
      if (!existingImages[index]) {
        URL.revokeObjectURL(newImagePreviews[index] as string);
      }
      newImagePreviews[index] = null;
    }

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);

    setValue(
      "images",
      newImageFiles.filter((img): img is File => img !== null)
    );
  };

  const uploadedCount =
    imageFiles.filter((file) => file !== null).length +
    existingImages.filter(
      (_img, i) => !imagesToRemove.includes(existingImages[i]?.vehicleImageId)
    ).length;
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

  // Function to prepare the form data for update
  const prepareFormData = (data: VehicleUpdateFormValues) => {
    const formData = new FormData();

    // Append all form fields
    formData.append("vehicleId", data.vehicleId);
    formData.append("registrationNumber", data.registrationNumber);
    formData.append("vehicleName", data.vehicleName);
    formData.append("vendorNumber", data.vendorNumber);
    formData.append("seatCapacity", data.seatCapacity.toString());
    formData.append("amtPerKM", data.amtPerKM.toString());
    formData.append("mileage", data.mileage.toString());
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("dayDriverBata", data.dayDriverBata.toString());
    formData.append("nightDriverBata", data.nightDriverBata.toString());
    formData.append("haltLocationAddress", data.haltLocationAddress);
    formData.append("busType", data.busType);
    formData.append("vehicleType", data.vehicleType);
    formData.append("isFastTagAvailable", data.isFastTagAvailable);
    formData.append("amenities", data.amenities.join(","));
    formData.append("vehicleStatus", data.vehicleStatus);

    // Handle images to remove
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    // Calculate image priorities
    const existingPriorities = existingImages
      .filter((img) => !imagesToRemove.includes(img.vehicleImageId))
      .map((img, idx) => idx + 1);

    const newPriorities = imageFiles
      .map((file, index) =>
        file ? existingPriorities.length + index + 1 : null
      )
      .filter((p): p is number => p !== null);

    const allPriorities = [...existingPriorities, ...newPriorities];
    formData.append("imagePriorities", allPriorities.join(","));

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    return formData;
  };

  // Function to handle the form submission
  const onSubmit = async (data: VehicleUpdateFormValues) => {

    const formData = prepareFormData(data);

    // Log FormData content
    for (const pair of formData.entries()) {
    }

    try {

      const response = await updateVehicle(formData);
      if (response) {
        toast.success("Vehicle updated successfully!");
        setOpenUp(false);
        queryClient.invalidateQueries({
          queryKey: ["vehicle", vehicle.vehicleId],
        });
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      } else {
        throw new Error("Failed to update vehicle");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
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
    <div>
      <Button variant="outline" onClick={() => setOpenUp(true)}>
        Update Vehicle
      </Button>
      <AnimatePresence>
        {openUp && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="fixed inset-0 bg-white shadow-xl z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="w-full h-full relative overflow-y-scroll"
              >
                <div className="h-[70px]  w-full mx-auto flex items-center justify-between fixed bg-white">
                  <div className="h-[70px] max-w-[1200px] w-full mx-auto flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-500">
                      Update Vehicle: {vehicle.vehicleId}
                    </h1>
                    <button
                      className="cursor-pointer bg-transparent flex items-center text-gray-500"
                      onClick={() => setOpenUp(false)}
                    >
                      close
                      <span className="text-sm">
                        <X height={18} width={18} />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="bg-[#FAFAFA] p-6 rounded-lg mt-[70px]">
                  <LoadScript
                    googleMapsApiKey="AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU"
                    libraries={libraries}
                    region="IN"
                    loadingElement={<Skeleton className="h-8 w-full" />}
                  >
                    <div className="min-h-screen w-full p-8">
                      <div className="max-w-4xl mx-auto px-8 py-10 bg-white rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-semibold text-gray-800">
                            Update Vehicle Information
                          </h2>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                          <p className="text-blue-700 font-medium">
                            Updating Vehicle ID: {vehicle.vehicleId}
                          </p>
                        </div>

                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-8"
                        >
                          {/* Hidden Vehicle ID field */}
                          <input type="hidden" {...register("vehicleId")} />

                          {/* Vehicle Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Number
                            </label>
                            <input
                              type="text"
                              {...register("registrationNumber")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.registrationNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter vehicle number"
                            />
                            {errors.registrationNumber && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.registrationNumber.message}
                              </p>
                            )}
                          </div>

                          {/* Vehicle Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Name
                            </label>
                            <input
                              type="text"
                              {...register("vehicleName")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.vehicleName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter vehicle name"
                            />
                            {errors.vehicleName && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.vehicleName.message}
                              </p>
                            )}
                          </div>

                          {/* Mobile Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vendor Number
                            </label>
                            <input
                              type="text"
                              {...register("vendorNumber")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.vendorNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter mobile number"
                            />
                            {errors.vendorNumber && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.vendorNumber.message}
                              </p>
                            )}
                            {vendor && (
                              <div className="mt-2 text-green-500">
                                Vendor: {vendor.vendorCompanyName} (ID:{" "}
                                {vendor.vendorId})
                              </div>
                            )}
                            {vendorError && (
                              <p className="text-red-500 text-xs mt-1">
                                {vendorError}
                              </p>
                            )}
                          </div>

                          {/* Seat Capacity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Seat Capacity
                            </label>
                            <input
                              type="number"
                              {...register("seatCapacity", {
                                valueAsNumber: true,
                              })}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.seatCapacity
                                  ? "border-red-500"
                                  : "border-gray-300"
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amount Per KM
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...register("amtPerKM", { valueAsNumber: true })}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.amtPerKM
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter amount per KM"
                            />
                            {errors.amtPerKM && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.amtPerKM.message}
                              </p>
                            )}
                          </div>

                          {/* Mileage */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mileage
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...register("mileage", { valueAsNumber: true })}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.mileage
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter mileage"
                            />
                            {errors.mileage && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.mileage.message}
                              </p>
                            )}
                          </div>
                          {/* Day Driver Bata */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Day Driver Bata (₹)
  </label>
  <input
    {...register("dayDriverBata", { valueAsNumber: true })}
    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
      errors.dayDriverBata ? "border-red-500" : "border-gray-300"
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
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Night Driver Bata (₹)
  </label>
  <input
    {...register("nightDriverBata", { valueAsNumber: true })}
    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
      errors.nightDriverBata ? "border-red-500" : "border-gray-300"
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


                          {/* Vehicle Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Type
                            </label>
                            <select
                              {...register("vehicleType")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.vehicleType
                                  ? "border-red-500"
                                  : "border-gray-300"
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

                          {/* Vehicle Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Status
                            </label>
                            <select
                              {...register("vehicleStatus")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.vehicleStatus
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="INACTIVE">Inactive</option>
                            </select>
                            {errors.vehicleStatus && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.vehicleStatus.message}
                              </p>
                            )}
                          </div>

                          {/* Amenities */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amenities
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAmenities.includes("Wifi")}
                                  onChange={() => handleAmenityToggle("Wifi")}
                                  className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
                                />
                                <span>Wifi</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAmenities.includes(
                                    "Charger"
                                  )}
                                  onChange={() =>
                                    handleAmenityToggle("Charger")
                                  }
                                  className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
                                />
                                <span>Charging Port</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAmenities.includes("TV")}
                                  onChange={() => handleAmenityToggle("TV")}
                                  className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
                                />
                                <span>TV</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAmenities.includes("CCTV")}
                                  onChange={() => handleAmenityToggle("CCTV")}
                                  className="rounded border-gray-300 text-[#0F7BAB] focus:ring-[#0F7BAB] h-4 w-4"
                                />
                                <span>CCTV</span>
                              </label>
                            </div>
                            {errors.amenities && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.amenities.message}
                              </p>
                            )}
                          </div>

                          {/* Halt Location */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Halt Location
                            </label>
                            <Autocomplete
                              onLoad={(ref) => (haltLocationRef.current = ref)}
                              onPlaceChanged={handlePlaceChanged}
                              options={{
                                componentRestrictions: { country: "IN" },
                              }}
                            >
                              <input
                                type="text"
                                {...register("haltLocationAddress")}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                  errors.haltLocationAddress
                                    ? "border-red-500"
                                    : "border-gray-300"
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

                          {/* Latitude */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Latitude
                            </label>
                            <input
                              type="text"
                              {...register("latitude")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.latitude
                                  ? "border-red-500"
                                  : "border-gray-300"
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Longitude
                            </label>
                            <input
                              type="text"
                              {...register("longitude")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.longitude
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter longitude"
                            />
                            {errors.longitude && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.longitude.message}
                              </p>
                            )}
                          </div>

                          {/* Fast Tag Available */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fast Tag Available
                            </label>
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  value="true"
                                  {...register("isFastTagAvailable")}
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  value="false"
                                  {...register("isFastTagAvailable")}
                                />
                                <span>No</span>
                              </label>
                            </div>
                            {errors.isFastTagAvailable && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.isFastTagAvailable.message}
                              </p>
                            )}
                          </div>

                          {/* Bus Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bus Type
                            </label>
                            <select
                              {...register("busType")}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F7BAB] focus:outline-none ${
                                errors.busType
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="AC">AC</option>
                              <option value="NA">Non-AC</option>
                            </select>
                            {errors.busType && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.busType.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">
                                Vehicle Images
                              </h3>
                              <span
                                style={{
                                  color:
                                    uploadedCount >= 5
                                      ? "#2F855A"
                                      : primaryColor,
                                }}
                              >
                                {uploadedCount}/6 images{" "}
                                {uploadedCount < 5
                                  ? `(${5 - uploadedCount} more required)`
                                  : ""}
                              </span>
                            </div>

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
                              <p className="text-sm font-medium">
                                Front view image is required and will be shown
                                first to customers
                              </p>
                            </div>

                            {errors.images && (
                              <p className="text-red-500 text-sm">
                                {errors.images.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div
                              className="relative aspect-video rounded-lg overflow-hidden border-2"
                              style={{
                                borderColor: imagePreviews[0]
                                  ? "#2F855A"
                                  : primaryColor,
                                borderStyle: imagePreviews[0]
                                  ? "solid"
                                  : "dashed",
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
                                      className="w-8 h-8"
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
                                      Image {index + 1}
                                    </div>
                                  </>
                                ) : (
                                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                    <div className="flex flex-col items-center justify-center">
                                      <Upload className="w-6 h-6 text-gray-400" />
                                      <span className="mt-1 text-xs text-gray-500">
                                        Add Image
                                      </span>
                                    </div>
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(e, index)
                                      }
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
                              className="w-full py-3 bg-[#0F7BAB] text-white rounded-lg hover:bg-[#0d6d7e] focus:outline-none"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Updating..." : "Update Vehicle"}
                            </button>
                          </div>
                        </form>
                      </div>
                      {isSubmitting && (
                        <div className="w-full h-screen fixed top-0 left-0 bg-black/20 flex items-center justify-center z-[99999]">
                          <div className="loader"></div>
                        </div>
                      )}
                    </div>
                  </LoadScript>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleUpdateForm;
