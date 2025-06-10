"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addVendor } from "@/app/services/admin.service";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { QueryObserverResult } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

const POLICY_TYPES = {
  CANCELLATION: "Cancellation Policy",
  DAMAGE: "Damage Policy",
  INSURANCE: "Insurance Policy",
} as const;

// Define schema
const vendorSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  contactNumber: z.string().min(1, { message: "Contact number is required" }),
  vendorCompanyName: z.string().min(1, { message: "Company name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  totalVehicles: z
    .number()
    .min(1, { message: "Total vehicles must be at least 1" }),
  policies: z.object({
    cancellation: z
      .array(z.string())
      .min(1, { message: "At least one cancellation policy is required" }),
    damage: z
      .array(z.string())
      .min(1, { message: "At least one damage policy is required" }),
    insurance: z
      .array(z.string())
      .min(1, { message: "At least one insurance policy is required" }),
  }),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

type PolicyType = "cancellation" | "damage" | "insurance";

interface VendorFormProps {
  venderDataRefetch: () => Promise<QueryObserverResult<unknown, unknown>>;
}

const VendorForm = ({ venderDataRefetch }: VendorFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      policies: {
        cancellation: [""],
        damage: [""],
        insurance: [""],
      },
    },
  });

  const [open, setOpen] = useState(false);

  const policies = watch("policies");

  // Fix: Update the policy handling functions to work with specific policy types
  const addPolicy = (type: keyof typeof POLICY_TYPES) => {
    const policyType = type.toLowerCase() as PolicyType;
    const currentPolicies = [...policies[policyType]];
    currentPolicies.push("");
    setValue(`policies.${policyType}`, currentPolicies, {
      shouldValidate: true,
    });
  };

  const removePolicy = (type: keyof typeof POLICY_TYPES, index: number) => {
    const policyType = type.toLowerCase() as PolicyType;
    const currentPolicies = [...policies[policyType]];
    currentPolicies.splice(index, 1);
    setValue(`policies.${policyType}`, currentPolicies, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: VendorFormValues) => {
    try {
      const filteredData = {
        ...data,
        policyRequests: [
          {
            policyDescription: "Cancellation Policy",
            policyMessages: data.policies.cancellation.filter(
              (policy) => policy.trim() !== ""
            ),
          },
          {
            policyDescription: "Damage Policy",
            policyMessages: data.policies.damage.filter(
              (policy) => policy.trim() !== ""
            ),
          },
          {
            policyDescription: "Insurance Policy",
            policyMessages: data.policies.insurance.filter(
              (policy) => policy.trim() !== ""
            ),
          },
        ],
      };

      const res = await addVendor(filteredData);
      if (res) {
        toast.success("Vendor added successfully!");
        reset();
        venderDataRefetch();
        setOpen(false);
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Fix: Update the policy section rendering to properly register fields
  const renderPolicySection = (type: keyof typeof POLICY_TYPES) => {
    const policyType = type.toLowerCase() as PolicyType;
    const policyArray = policies[policyType] || [];

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">{POLICY_TYPES[type]}</h3>
          <button
            type="button"
            onClick={() => addPolicy(type)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Policy
          </button>
        </div>

        <div className="space-y-3">
          {policyArray.map((_, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                type="text"
                {...register(`policies.${policyType}.${index}`)}
                className={`flex-1 px-3 py-2 border rounded-md ${
                  errors.policies?.[policyType]?.[index]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={`Enter ${POLICY_TYPES[type].toLowerCase()}`}
              />
              {policyArray.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePolicy(type, index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Button to Open Sheet */}
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add Vendor
      </Button>

      {/* AnimatePresence Wrapper for exit animation */}
      <AnimatePresence>
        {open && (
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
              <div className="h-[70px] bg-white border-b-[1px] border-b-gray-200 fixed top-0 left-0 w-full ">
                <div className="h-[70px] max-w-[1200px] w-full mx-auto flex items-center justify-between">
                  <h1 className="text-lg font-bold text-gray-500">
                    Add a New Vendor
                  </h1>
                  <button
                    className="cursor-pointer bg-transparent flex items-center text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    close
                    <span className="text-sm">
                      <X height={18} width={18} />
                    </span>
                  </button>
                </div>
              </div>

              <div className=" bg-[#FAFAFA] p-6 rounded-lg mt-[70px] ">
                <div className="max-w-[600px] mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  {/* First Name and Last Name in the same row on large screens */}
  <div className="lg:flex lg:space-x-4">
    <div className="lg:w-1/2">
      <label className="block text-sm font-medium mb-1">
        First Name
      </label>
      <input
        type="text"
        {...register("firstName")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.firstName
            ? "border-red-500"
            : "border-gray-300"
        }`}
        placeholder="Enter first name"
        onKeyDown={(e) => {
          if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
          }
        }}
      />
      {errors.firstName && (
        <p className="text-red-500 text-xs mt-1">
          {errors.firstName.message}
        </p>
      )}
    </div>

    <div className="lg:w-1/2">
      <label className="block text-sm font-medium mb-1">
        Last Name
      </label>
      <input
        type="text"
        {...register("lastName")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.lastName
            ? "border-red-500"
            : "border-gray-300"
        }`}
        placeholder="Enter last name"
        onKeyDown={(e) => {
          if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
          }
        }}
      />
      {errors.lastName && (
        <p className="text-red-500 text-xs mt-1">
          {errors.lastName.message}
        </p>
      )}
    </div>
  </div>

  {/* Email and Contact Number in the same row on large screens */}
  <div className="lg:flex lg:space-x-4">
    <div className="lg:w-1/2">
      <label className="block text-sm font-medium mb-1">
        Email
      </label>
      <input
        type="email"
        {...register("email")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.email ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Enter email"
      />
      {errors.email && (
        <p className="text-red-500 text-xs mt-1">
          {errors.email.message}
        </p>
      )}
    </div>

    <div className="lg:w-1/2">
      <label className="block text-sm font-medium mb-1">
        Contact Number
      </label>
      <input
        minLength={10}
        maxLength={10}
        onInput={(e) => {
          e.currentTarget.value =
            e.currentTarget.value.replace(/[^0-9]/g, "");
        }}
        type="text"
        {...register("contactNumber")}
        className={`w-full px-3 py-2 border rounded-md ${
          errors.contactNumber
            ? "border-red-500"
            : "border-gray-300"
        }`}
        placeholder="Enter contact number"
        onKeyDown={(e) => {
          if (!/^[0-9]*$/.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
          }
        }}
      />
      {errors.contactNumber && (
        <p className="text-red-500 text-xs mt-1">
          {errors.contactNumber.message}
        </p>
      )}
    </div>
  </div>

  {/* Company Name (Full width on large screens) */}
  <div>
    <label className="block text-sm font-medium mb-1">
      Company Name
    </label>
    <input
      type="text"
      {...register("vendorCompanyName")}
      className={`w-full px-3 py-2 border rounded-md ${
        errors.vendorCompanyName
          ? "border-red-500"
          : "border-gray-300"
      }`}
      placeholder="Enter company name"
    />
    {errors.vendorCompanyName && (
      <p className="text-red-500 text-xs mt-1">
        {errors.vendorCompanyName.message}
      </p>
    )}
  </div>

  {/* Address (Separate row) */}
  <div>
    <label className="block text-sm font-medium mb-1">
      Address
    </label>
    <textarea
      {...register("address")}
      className={`w-full px-3 py-2 border rounded-md ${
        errors.address ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="Enter address"
    />
    {errors.address && (
      <p className="text-red-500 text-xs mt-1">
        {errors.address.message}
      </p>
    )}
  </div>

  {/* Total Vehicles (Separate row) */}
  <div>
    <label className="block text-sm font-medium mb-1">
      Total Vehicles
    </label>
    <input
      type="number"
      {...register("totalVehicles", { valueAsNumber: true })}
      min="1"
      step="any"
      className={`w-full px-3 py-2 border rounded-md ${
        errors.totalVehicles
          ? "border-red-500"
          : "border-gray-300"
      }`}
      placeholder="Enter total vehicles"
      onInput={(e) => {
        const input = e.target as HTMLInputElement;
        if (input.value.includes("-")) {
          input.value = input.value.replace("-", "");
        }
      }}
      onKeyDown={(e) => {
        if (!/^[0-9]*$/.test(e.key) && e.key !== "Backspace") {
          e.preventDefault();
        }
      }}
    />

    {errors.totalVehicles && (
      <p className="text-red-500 text-xs mt-1">
        {errors.totalVehicles.message}
      </p>
    )}
  </div>

  <div className="bg-gray-50 p-6 rounded-lg space-y-6">
    <h3 className="text-lg font-semibold mb-4">Policies</h3>
    {renderPolicySection("CANCELLATION")}
    {renderPolicySection("DAMAGE")}
    {renderPolicySection("INSURANCE")}
  </div>

  {/* Submit Button */}
  <Button
    type="submit"
    className="w-full bg-[#0F7BAB] cursor-pointer text-white font-semibold py-2 rounded-md hover:bg-[#0E6A99]"
  >
    Submit
  </Button>
</form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VendorForm;
