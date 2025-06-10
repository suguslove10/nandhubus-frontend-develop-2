import { selectAuth } from "@/app/Redux/authSlice";
import { UserProfile } from "@/app/types/profile.type";
import React from "react";
import { useSelector } from "react-redux";

interface ProfileViewProps {
  userData: UserProfile;
}

export default function ProfileView({ userData }: ProfileViewProps) {
  const auth = useSelector(selectAuth);
  
  return (
    <div className="p-5 bg-gray-50 rounded-lg sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-5">
        <div>
          <p className="text-sm text-gray-500">YOUR NAME</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            {userData.firstName} {userData.lastName}
          </p>
        </div>
      </div>
      
      <div className="mb-5">
        <p className="text-sm text-gray-500">GENDER</p>
        <p className="text-lg sm:text-xl font-semibold text-gray-700">
          {userData.gender}
        </p>
      </div>
      
      <div className="border-t pt-5">
        <h3 className="text-md font-medium text-[#01374e] text-center mb-3">
          CONTACT DETAILS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">EMAIL ID</p>
            <p className="text-md font-semibold text-gray-700 break-words">
              {userData.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">MOBILE NUMBER</p>
            <p className="text-md font-semibold text-gray-700">
              {userData.mobile}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}