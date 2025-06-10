// BookingContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { myBookings } from "@/app/services/data.service";
import { BookingResponse } from "@/app/types/bookingdetailsResponse.type";

// Define the context type
interface BookingContextType {
  bookingData: BookingResponse | null;
  getBookings: (mobile: string) => Promise<BookingResponse>;
  fetchBookings: (mobile: string) => void;
  isError: boolean;
  error: Error | null;
  isLoading: boolean;
}

// Create the context with default values
const BookingContext = createContext<BookingContextType>({
  bookingData: null,
  getBookings: async () => {
    throw new Error("getBookings was called outside of BookingProvider");
  },
  fetchBookings: () => {
    throw new Error("fetchBookings was called outside of BookingProvider");
  },
  isError: false,
  error: null,
  isLoading: false,
});

// Props for the BookingProvider component
interface BookingProviderProps {
  children: ReactNode;
}

// Create the provider component
export const BookingProvider = ({ children }: BookingProviderProps) => {
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);

  // Use mutation for bookings
  const mutation = useMutation<BookingResponse, Error, string>({
    mutationFn: (mobile: string) => myBookings(mobile),
    onSuccess: (data: BookingResponse) => {
      setBookingData(data);
    },
  });

  // Function to fetch bookings directly
  const getBookings = async (mobile: string): Promise<BookingResponse> => {
    try {
      const data = await myBookings(mobile);
      setBookingData(data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Context value
  const value = {
    bookingData,
    getBookings,
    fetchBookings: mutation.mutate,
    isError: mutation.isError,
    error: mutation.error,
    isLoading: mutation.isPending, // Using isPending from latest tanstack/react-query v4+
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

// Custom hook to use the booking context
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};