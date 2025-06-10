"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_CONSTANTS } from "./api.route";
import { ILoginResponse } from "../types/loginResponse.type";
import { ISendOtpLoginRequest } from "../types/login.type";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./httpServices";
import toast from "react-hot-toast";
import React from "react";
import { FAQResponse } from "../(public)/Faqs/faq";
import { Booking } from "@/types/booking/type";
import { BookingResponse } from "../types/bookingdetailsResponse.type";
import { UserProfile } from "../types/profile.type";
import { logout } from "../Redux/authSlice";
import { Vehicle } from "../types/vehicleresponse.type";
import { restrictBody } from "../types/restrictdate.type";
import { CreditCard } from "../types/carddetails.type";
import { CreditCardDetails } from "../types/cardResponse.type";
import { VehicleDto } from "../types/price.response";
import { TravelPackage } from "../types/package.response";
import { distanceResponse } from "../types/distancecalculationresponse";
import { PackageVehicleList } from "../types/package.list";
import { useBookings } from "../hooks/mybookings/BookingContext";
import { VehiclePriceRequest, VehiclePriceSummaryRequest } from "../types/calculateMultipleresponse";
import { VehicleCalculationData } from "../types/multipleCalculationresponse";
import { FareCalculationResponse } from "../types/fareCalculationresponse";
import { FilterPayload } from "../types/fetchFilter.type";

/* filter menu */
export const getFilterResponse = async () => {
  try {
    const res = await getRequest(API_CONSTANTS.VEHICLE.FILTER_MENU);
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchFilteredData = async (
  fromDate: string,
  toDate: string,
  vehicleAC: string[],
  seaterType: string[]
) => {
  try {
    const data = {
      fromDate,
      toDate,
      vehicleAC,
      seaterType,
    };

    const res = await postRequest(
      API_CONSTANTS.VEHICLE.FETCH_FILTER_PRODUCTS,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res;
  } catch (error) {
    throw error;
  }
};

/* list vehicles */
export const checkVehicleAvailability = async (
  source: string,
  destination: string,
  fromDate: string,
  toDate: string,
  distanceInKm: number,
  sourceLatitude: number,
  sourceLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
  tripExtraDays:number,
  isReschedule?: boolean,
  isMultiReschedule?:boolean,
  bookingId?: string
) => {
  try {
    const url = API_CONSTANTS.VEHICLE.LIST_VEHICLES(
      source,
      destination,
      fromDate,
      toDate,
      distanceInKm,
      sourceLatitude,
      sourceLongitude,
      destinationLatitude,
      destinationLongitude,
      tripExtraDays,
      isReschedule,
      isMultiReschedule,
      bookingId
    );
    const res = await getRequest(url);
    return res;
  } catch (error) {
    console.error("Error checking vehicle availability", error);
    throw error;
  }
};

/* login */
const sendOTPRequest = async (mobile: string) => {
  const response = await postRequest(API_CONSTANTS.USER.SEND_OTP(mobile));

  return response;
};

export const useSendOTP = () => {
  return useMutation({
    mutationFn: sendOTPRequest,
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      throw error;
    },
  });
};

export const resendOtpRequest = async (phoneNumber: string) => {
  try {
    const res = await getRequest(`/api/resendOtp?phoneNumber=${phoneNumber}`);
  } catch (error) {
    throw error;
  }
};

const validateOTPRequest = async ({
  mobile,
  otp,
}: {
  mobile: string;
  otp: string;
}) => {
  const response = await postRequest(API_CONSTANTS.USER.VALIDATE_OTP, {
    mobile,
    otp,
  });
  return response;
};

export const useValidateOTP = () => {
  return useMutation({
    mutationFn: validateOTPRequest,
    onSuccess: (data) => {
    },
    onError: (error) => {
    },
  });
};

export const loginService = async (
  data: ISendOtpLoginRequest
): Promise<ILoginResponse> => {
  try {
    const response = await postRequest<ILoginResponse>(
      API_CONSTANTS.USER.LOGIN,
      data
    );

    localStorage.setItem("accesstoken", response.authTokenResponse.accessToken);


    return response;
  } catch (error) {
    throw error;
  }
};

/* contact Us */
export const getInTouch = async (data: {
  email: string;
  subject: string;
  name: string;
  message: string;
}) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.BOOKING.GET_IN_TOUCH,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
type DeclineBookingResponse = {
  message: string;
  success?: boolean;
};

/* cancel */
export const declineBookingRequest = async (
  bookingId: string,
  reason: string
): Promise<DeclineBookingResponse> => {
  const response = await getRequest<DeclineBookingResponse>(
    API_CONSTANTS.BOOKING.DECLINE_BOOKING(bookingId, reason)
  );
  return response;
};



export const useDeclineBooking = (phoneNumber?: string) => {
  const { getBookings, bookingData } = useBookings();

  return useMutation({
mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
  declineBookingRequest(bookingId, reason),

    onSuccess: () => {
      if (phoneNumber) getBookings(phoneNumber);
    },
    onError: () => {
      toast.error("Error declining booking");
    },
    throwOnError: true,
  });
};


/* add booking */
const addBookingRequest = async (requestBody: any) => {
  const response = await postRequest(
    API_CONSTANTS.BOOKING.ADD_BOOKING,
    requestBody
  );
  return response;
};

export const useAddBooking = () => {
  return useMutation({
    mutationFn: (requestBody: any) => addBookingRequest(requestBody),
    onSuccess: (data) => {
    },
    onError: (error) => {
    },
  });
};

/* FAQ */
const getAllFaqsRequest = async (): Promise<FAQResponse> => {
  const response = await getRequest(API_CONSTANTS.FAQS.GET_FAQS);
  return response as FAQResponse;
};

export const useGetAllFaqs = () => {
  const query = useQuery<FAQResponse>({
    queryKey: ["faqs"],
    queryFn: getAllFaqsRequest,
  });

  React.useEffect(() => {
    if (query.isSuccess) {
    }
    if (query.isError) {
    }
  }, [query.isSuccess, query.isError]);

  return query;
};

/* razor pay */
export const createPayment = async (requestBody: any) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.CREATE_PAYMENT,
      requestBody
    );
    return response;
  } catch (error) {
    throw new Error("Error creating payment");
  }
};

export const verifyPaymentSignature = async (postData: any) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.VERIFY_SIGNATURE,
      postData
    );
    return response;
  } catch (error) {
    throw new Error("Error verifying payment signature");
  }
};

/* Reschedule */
const rescheduleBookingRequest = async (requestBody: any) => {
  const response = await postRequest(
    API_CONSTANTS.BOOKING.RESHEDULE_BOOKING,
    requestBody
  );
  return response;
};

export const useRescheduleBooking = () => {
  return useMutation({
    mutationFn: (requestBody: any) => rescheduleBookingRequest(requestBody),

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.field ||
        "Unexpected error occurred";
      toast.error(errorMessage);
    },
  });
};

/* revert booking */
export const revertBooking = async (bookingId: string) => {
  try {
    const response = await deleteRequest(
      API_CONSTANTS.PAYMENT.REVERT_BOOKING(bookingId)
    );
    return response;
  } catch (error) {
    throw new Error("Error reverting booking");
  }
};

export const updateTripStatus = async (bookingId: string, status: string) => {
  try {
    const response = await putRequest(
      API_CONSTANTS.VENDOR.TRIP_STATUS(bookingId, status)
    );
    return response;
  } catch (error) {
    throw new Error("Error updating trip status");
  }
};

/* invoice */
type InvoiceType = "invoice" | "proforma" | "reschedule";

export const downloadInvoiceReport = async (
  bookingId: string,
  type: "invoice" | "proforma" | "reschedule"
) => {
  try {
    const response = await getRequest(
      API_CONSTANTS.DOWNLOAD_REPORT(bookingId, type),
      { responseType: "blob" }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/* Booking details */
export const myBookings = async (mobile: string): Promise<BookingResponse> => {
  const response = await getRequest(
    API_CONSTANTS.BOOKING.GET_BOOKING_DETAILS(mobile)
  );
  return response as BookingResponse;
};

const fetchBookingInfoById = async (bookingId: string): Promise<Booking> => {
  const response = await getRequest(
    API_CONSTANTS.BOOKING.GET_BOOKING_INFO_BY_ID(bookingId)
  );
  return response as Booking;
};

export const useFetchBookingInfo = () => {
  return useMutation({
    mutationFn: (bookingId: string) => fetchBookingInfoById(bookingId),
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error("Error fetching booking information:", error);
    },
  });
};

/* fare calculation */
interface FareCalculationPayload {
  vehicleNumber: string;
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  baseFare: number;
}



export const fareCalculations = async (
  payload: FareCalculationPayload
): Promise<FareCalculationResponse> => {
  try {
    const response = await postRequest(
      API_CONSTANTS.BOOKING.FARE_CALCULATION,
      payload
    );

    if (!response) {
    }

    return response as FareCalculationResponse;
  } catch (error) {
    throw error;
  }
};
export const findLowestPrice = async (startDate: string, packageName: string) => {
  try {
    const response = await getRequest(
      API_CONSTANTS.BOOKING.FIND_LOWEST_PRICE(startDate, packageName)
    );
    return response;
  } catch (error) {
    throw new Error("Error finding lowest price");
  }
};
interface distanceCalculationPayload {
  source: string;
  sourceLatitude: number;
  sourceLongitude: number;
  destination: string;
  destinationLatitude: number;
  destinationLongitude: number;
}
export const distanceCalculation = async (
  payload: distanceCalculationPayload
): Promise<distanceResponse> => {
  try {
    const response = await postRequest(
      API_CONSTANTS.BOOKING.DISTANCE_CALCULATION,
      payload
    );

    if (!response) {
      throw new Error("Failed to calculate fare: No response received");
    }

    return response as distanceResponse;
  } catch (error) {
    throw error;
  }
};

export const getVendorVehiclesById = async (
  vendorId: string
): Promise<Vehicle[]> => {
  try {
    const res = await getRequest(
      `/api/getVendorVehicleData?vendorId=${vendorId}`
    );
    return res as Vehicle[];
  } catch (error) {
    throw error;
  }
};

/* profile */
export const updateProfile = async (
  userProfile: UserProfile
): Promise<UserProfile> => {
  try {
    const response = await putRequest<UserProfile>(
      API_CONSTANTS.USER.UPDATE_PROFILE,
      userProfile
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/* logout */
export const logoutUser = async (dispatch: any) => {
  try {
    const response = await postRequest(API_CONSTANTS.USER.LOGOUT);

    if (!response) {
      throw new Error("Logout failed");
    }

    dispatch(logout());

    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }

    return response;
  } catch (error) {
    throw new Error("Logout failed");
  }
};

/* vendor */
export const addVendorProfile = async (requestBody: any) => {
  try {
    const response = await putRequest(
      API_CONSTANTS.VENDOR.ADD_PROFILE,
      requestBody
    );
    return response;
  } catch (error) {
    throw new Error("Error updating vendor profile");
  }
};

export const fetchVehicleList = async (): Promise<Vehicle[]> => {
  const response = await getRequest(API_CONSTANTS.VEHICLE.VEHICLES_LIST);
  return response as Vehicle[];
};

export const updateAvailability = async (
  restrictbody: restrictBody
): Promise<restrictBody> => {
  try {
    const response = await postRequest<restrictBody>(
      API_CONSTANTS.ADMIN.UPDATE_AVAILABILITY,
      restrictbody
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleUnavailableDates = async (
  vehicleNumber: string,
  vendorCompanyName: string
): Promise<UnavailableDate[]> => {
  const response = await getRequest(
    API_CONSTANTS.ADMIN.VEHICLE_UNAVAILABLE(vehicleNumber, vendorCompanyName)
  );
  return response as UnavailableDate[];
};

/* card details */
export const fetchCardDetails = async (): Promise<CreditCard[]> => {
  const response = await getRequest(API_CONSTANTS.CARD.GET_CARDDETAILS);
  return response as CreditCard[];
};

export const saveCardDetails = async (
  creditcardresponse: CreditCardDetails
): Promise<CreditCardDetails> => {
  try {
    const response = await postRequest<CreditCardDetails>(
      API_CONSTANTS.CARD.SAVE_CARDDETAILS,
      creditcardresponse
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/* multiple booking price summary */
export const calculatePriceSummary = async (
  payload: VehiclePriceSummaryRequest
): Promise<VehicleCalculationData> => {
  try {
    const response = await postRequest<VehicleCalculationData>(API_CONSTANTS.VEHICLE.CALCULATE_PRICE_SUMMARY, payload);
    return response;
  } catch (error) {
    console.error("Error calculating vehicle price summary:", error);
    throw error;
  }
};



/* package booking */
export const getAllPackages = async (): Promise<TravelPackage[]> => {
  try {
    const res = await getRequest(API_CONSTANTS.VEHICLE.GET_PACKAGES);
    return res as TravelPackage[];
  } catch (error) {
    console.error("Error getting all the packages:", error);
    return [];
  }
};

export const getBusRevenue = async (vehicleNumber: string) => {
  try {
    const response = await getRequest(
      API_CONSTANTS.DASHBOARD.BUS_REVENUE(vehicleNumber)
    );
    return response;
  } catch (error) {
    
    throw new Error("Error fetching bus revenue");
  }
};

export const getAllRevenue = async (status:string,year:number) => {
  try {
    const response = await getRequest(API_CONSTANTS.DASHBOARD.GET_ALL_REVENUE(status,year));
    return response;
  } catch (error) {
    throw new Error("Error fetching all revenue");
  }
};

export const getTopRated = async () => {
  try {
    const response = await getRequest(API_CONSTANTS.DASHBOARD.TOP_RATED);
    return response;
  } catch (error) {
    throw new Error("Error fetching top rated vehicles");
  }
};

export const getAllVehicles = async () => {
  try {
    const response = await getRequest(API_CONSTANTS.VEHICLE.GET_ALL_VEHICLES);
    return response;
  } catch (error) {
    throw new Error("Error fetching all vehicles");
  }
};

export const packageVehicleList = async (
  fromDate: string,
  packageName: string,
  source: string,
  sourceLatitude: number,
  sourceLongitude: number,
) => {
  try {
    const res = await getRequest(
      API_CONSTANTS.VEHICLE.GET_PACKAGE_VEHICLE(fromDate, packageName,source, sourceLatitude, sourceLongitude)
    );
    return res as PackageVehicleList[];
  } catch (error) {
  }
};


  export const getRefundAmountById = async (bookingId: string) => {
    try {
      const response = await getRequest(
        API_CONSTANTS.BOOKING.GET_REFUND_AMOUNT_BY_ID(bookingId)
      );
      return response;
    } catch (error) {
      throw new Error("Error fetching refund amount");
    }
  };
 export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const response = await getRequest(API_CONSTANTS.BOOKING.COUPON_APPLY);
    return response as Coupon[];
  } catch (error) {
    throw new Error("Error fetching coupons");
  }
};



  export const confirmReschedule = async (bookingId: string) => {
    try {
      const response = await postRequest(
        API_CONSTANTS.BOOKING.RESCHEDULE_CONFIRM, // Assuming it's a static URL
        { bookingId } // Send bookingId in the request body
      );
      return response;
    } catch (error) {
      throw new Error("Error confirming reschedule");
    }
  };
  export const fetchAdminFilters = async (): Promise<FilterPayload> => {
  const response = await getRequest<FilterPayload>(
    API_CONSTANTS.ADMIN.FETCH_FILTER
  );
  return response;
};
interface ReviewDataRequest {

  bookingId: string;
  vehicleId: string;
  rating: number;
  reviewDescription: string;
}

export const addReview = async (
  bookingId: string,
  vehicleId: string[],
  rating: number,
  reviewDescription: string,
  images: File[] | null,
  videos: File[] | null
) => {
  const formData = new FormData();

  // Append scalar fields directly
  formData.append('bookingId', bookingId);
  formData.append('vehicleId', vehicleId.join(','));
  formData.append('rating', rating.toString());
  formData.append('reviewDescription', reviewDescription);

  // Append image files
 if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }

  // Append video files if they exist
  if (videos && videos.length > 0) {
    videos.forEach((file) => {
      formData.append('videos', file);
    });
  }

  try {
    const response = await postRequest(API_CONSTANTS.REVIEW.ADD_REVIEW, formData, {
      headers: {
           'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};


interface ReviewUpdateDataRequest {
  reviewId: string[]; // Add this for updates
  bookingId: string;
  vehicleId: string[];
  rating: number;
  reviewDescription: string;
}
  export const updateReview = async (
  reviewId: string[], // Add this for updates
  bookingId: string,
  vehicleId: string[],
  rating: number,
  reviewDescription: string,
  images: File[] | null,
  videos: File[] | null
) => {
  const formData = new FormData();

  // Append review JSON data
  formData.append('reviewId', reviewId.join(',')); // 
 formData.append('bookingId', bookingId);
  formData.append('vehicleId', vehicleId.join(','));
  formData.append('rating', rating.toString());
  formData.append('reviewDescription', reviewDescription);

  // Append images (if provided)
 if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }

  // Append video files if they exist
  if (videos && videos.length > 0) {
    videos.forEach((file) => {
      formData.append('videos', file);
    });
  }

  try {
    const response = await putRequest(
      API_CONSTANTS.REVIEW.UPDATE_REVIEW, // Define this endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};
