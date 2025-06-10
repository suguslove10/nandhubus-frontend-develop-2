// ProfileEdit Component
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { UserProfile } from "@/app/types/profile.type";
import { updateProfile } from "@/app/services/data.service";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "@/app/Redux/authSlice";

interface ProfileEditProps {
  userData: UserProfile;
  saveProfile: (values: UserProfile) => void;
  setIsEditing: (value: boolean) => void;
  isUpdating: boolean;
}

export default function ProfileEdit({
  userData,
  saveProfile,
  setIsEditing,
  isUpdating,
}: ProfileEditProps) {
  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Mobile Number is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female"], "Gender is required")
      .required("Gender is required"),
  });
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={userData}
      validationSchema={ProfileSchema}
      onSubmit={async (values) => {
        try {
          await updateProfile(values);
          dispatch(updateUserProfile(values));
          setIsEditing(false);
        } catch (error) {
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#01374e] mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <Field
                  name="firstName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7bab] focus:border-transparent transition duration-200"
                  placeholder="Enter first name"
                  onKeyPress={(e:any) => {
                    if (!/^[a-zA-Z\s-]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium  text-gray-600">Middle Name</label>
                <Field
                  name="middleName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7bab] focus:border-transparent transition duration-200"
                  placeholder="Enter middle name"
                  onKeyPress={(e:any) => {
                    if (!/^[a-zA-Z\s-]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <Field
                  name="lastName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7bab] focus:border-transparent transition duration-200"
                  placeholder="Enter last name"
                  onKeyPress={(e:any) => {
                    if (!/^[a-zA-Z\s-]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Field
                    type="radio"
                    name="gender"
                    value="Male"
                    className="h-4 w-4 text-[#0f7bab] focus:ring-[#0f7bab]"
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Field
                    type="radio"
                    name="gender"
                    value="Female"
                    className="h-4 w-4 text-[#0f7bab] focus:ring-[#0f7bab]"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
              </div>
              {errors.gender && touched.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#01374e] mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Email Address</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7bab] focus:border-transparent transition duration-200"
                  placeholder="Enter email address"
                  onKeyPress={(e:any) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
                <Field
                  name="mobile"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7bab] focus:border-transparent transition duration-200"
                  placeholder="Enter 10-digit mobile number"
                  onKeyPress={(e:any) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onInput={(e:any) => {
                    const input = e.currentTarget;
                    if (input.value.length > 10) {
                      input.value = input.value.slice(0, 10);
                    }
                  }}
                  maxLength={10}
                />
                {errors.mobile && touched.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition duration-200 flex items-center"
              onClick={() => setIsEditing(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#0f7bab] text-white rounded-lg font-medium hover:opacity-90 transition duration-200 flex items-center shadow-md"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save 
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}