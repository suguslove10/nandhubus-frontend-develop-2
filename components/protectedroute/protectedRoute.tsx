"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/app/Redux/authSlice";
import { useRouter } from "next/navigation";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace("/"); 
    }
  }, [auth.isAuthenticated, router]);

//   if (!auth.isAuthenticated) {
//     return <LoadingSpinner />; // Show loading indicator until redirect
//   }

return auth.isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
