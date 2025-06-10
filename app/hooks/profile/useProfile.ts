import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/app/services/data.service"; // Adjust path as needed
import { useState } from "react";
import { UserProfile } from "@/app/types/profile.type";
import { updateUserProfile } from "@/app/Redux/authSlice";
import { useDispatch } from "react-redux";

export const useProfile = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
const dispatch=useDispatch();
  // Mutation for updating the profile
  const mutation = useMutation<UserProfile, Error, UserProfile>({
    mutationFn: async (userProfile: UserProfile): Promise<UserProfile> => {
      return await updateProfile(userProfile);
      
    },
    onSuccess: (data: UserProfile) => {
      dispatch(updateUserProfile(data));
    },
  });

  // Async function to manually update profile without mutation
  const saveProfile = async (userProfile: UserProfile): Promise<UserProfile> => {
    try {
      const data: UserProfile = await updateProfile(userProfile);
      setProfileData(data);
      dispatch(updateUserProfile(data)); 
      return data;
    } catch (err) {
      throw err;
    }
  };
  

  return {
    updateProfile: mutation.mutate,
    saveProfile, // Direct API call alternative
    profileData,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
