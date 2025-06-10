"use client";
import { addVendorProfile } from "@/app/services/data.service";
import React, { useState } from "react";

const VendorProfileForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        vendorCompanyName: "",
        address: "",
        totalVehicles: "",
        availableVehicles: "",
        gstNumber: "",
      });
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await addVendorProfile(formData);
          alert("Vendor profile added successfully!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Failed to add vendor profile.");
        }
      };
    
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Create Your Vendor Profile</h1>
        <p className="text-gray-600 mb-6">
          Get started by providing your business information
        </p>

        <form onSubmit={handleSubmit}>
          {/* Personal Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
    
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="enter email address"
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This email will be used for all communications
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="enter contact number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="your company name"
                    name="vendorCompanyName"
                    value={formData.vendorCompanyName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Address
                  </label>
                  <input
                    type="text"
                    placeholder="enter address"

                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Vehicles
                  </label>
                  <input
                    type="text"
                    name="totalVehicles"
                    value={formData.totalVehicles}
                    onChange={handleChange}
                    placeholder="Enter total vehicles"
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available Vehicles
                  </label>
                  <input
                    type="text"
                    name="availableVehicles"
                    value={formData.availableVehicles}
                    onChange={handleChange}
                    placeholder="Enter available vehicles"
                    className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GST Number
                </label>
                <input
                  type="text"
                  placeholder="Enter valid GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border-0 border-b border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-0 focus:border-indigo-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Format: 2 digits, 5 letters, 4 digits, 1 letter, 1 letter
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProfileForm;
