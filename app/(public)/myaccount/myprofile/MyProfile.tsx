"use client";
import React, { useEffect, useState } from "react";
import { useProfile } from "@/app/hooks/profile/useProfile";
import { selectAuth } from "@/app/Redux/authSlice";
import { useSelector } from "react-redux";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

export default function MyProfile() {
  const { saveProfile, isUpdating, profileData } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const auth = useSelector(selectAuth);
  
  const userData = {
    firstName: auth.user?.user.firstName || "",
    lastName: auth.user?.user.lastName || "",
    middleName: "",
    gender: auth.user?.user.gender || "--",
    email: auth.user?.user.email || "",
    mobile: auth.user?.user.mobile || "",
  };

  useEffect(() => {
  }, [profileData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              My Profile
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0f7bab] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="px-6 py-5">
            {isEditing ? (
              <ProfileEdit
                userData={userData}
                saveProfile={saveProfile}
                setIsEditing={setIsEditing}
                isUpdating={isUpdating}
              />
            ) : (
              <ProfileView userData={userData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}