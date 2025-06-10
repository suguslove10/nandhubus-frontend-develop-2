export const API_CONSTANTS = {
  USER: {
    LOGIN: "/api/login",
    VALIDATE_OTP: "/api/validateOTP",
    SEND_OTP: (mobile: string) => `/api/sendOTP?phoneNumber=${mobile}`,
    UPDATE_PROFILE: "/api/updateProfile",
    LOGOUT: "/api/logout",
  },

  VEHICLE: {
    GET_VEHICLE: (vehicleNumber: string) =>
      `/api/getVehicle?vehicleNumber=${vehicleNumber}`,
    FILTER_MENU: "/api/filterMenu",
    GET_ALL_VEHICLES: "/api/vehicle/getAllVehicles",
    FETCH_FILTER_PRODUCTS: "/api/filter",
    CALCULATE_PRICE_SUMMARY: "/api/vehicles/calculate-multiple",
    LIST_VEHICLES: (
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
      bookingId?: string,
      
    ) =>
      `/api/checkVehicleAvailability?source=${source}&destination=${destination}&fromDate=${fromDate}&toDate=${toDate}&distanceInKm=${distanceInKm}&sourceLatitude=${sourceLatitude}&sourceLongitude=${sourceLongitude}&destinationLatitude=${destinationLatitude}&tripExtraDays=${tripExtraDays}&destinationLongitude=${destinationLongitude}${
        isReschedule ? `&isReschedule=${isReschedule}` : ""
      }${isMultiReschedule? `&isMultiReschedule=${isMultiReschedule}`:""}${bookingId ? `&bookingId=${bookingId}` : ""}`,
    VEHICLES_LIST: `/api/listVehicles`,
    GET_PACKAGES: "/api/getAllPackages",
    GET_PACKAGE_VEHICLE: (
      fromDate: string,
      packageName: string,
      source: string,
      sourceLatitude: number,
      sourceLongitude: number,

      isReschedule?: boolean,
      bookingId?: string
    ) => {
      let baseUrl = `/api/checkPackageVehicleAvailability?fromDate=${fromDate}&packageName=${packageName}&source=${source}&sourceLatitude=${sourceLatitude}&sourceLongitude=${sourceLongitude}`;
    
      if (isReschedule !== undefined) {
        baseUrl += `&isReschedule=${isReschedule}`;
      }
    
      if (bookingId) {
        baseUrl += `&bookingId=${bookingId}`;
      }
    
      return baseUrl;
    }
      
  },

  BOOKING: {
    ADD_BOOKING: "/api/booking",
    GET_BOOKING_DETAILS: (mobile: string) =>
      `/api/bookingDetails?mobile=${mobile}`,
    CONFIRM_BOOKING: (bookingId: string) =>
      `/api/confirm?bookingId=${bookingId}`,
    DECLINE_BOOKING: (bookingId: string, reason: string) =>
  `/api/decline?bookingId=${bookingId}&reason=${encodeURIComponent(reason)}`,
  

    GET_BOOKING_INFO_BY_ID: (bookingId: string) =>
      `/api/getBookingInfo?bookingId=${bookingId}`,
    GET_VEHICLE_AVAILABILITY: "/api/getVehicleAvailability",
    RESHEDULE_BOOKING: "/api/reschedule",
    GET_IN_TOUCH: "/api/getInTouch",
    FARE_CALCULATION: "/api/calculations",
    DISTANCE_CALCULATION: "/api/calculateDistance",
    FIND_LOWEST_PRICE: (startDate: string, packageName: string) =>
      `/api/findLowestPrice?startDate=${encodeURIComponent(startDate)}&packageName=${encodeURIComponent(packageName)}`,
    GET_REFUND_AMOUNT_BY_ID: (bookingId: string) =>
  `/api/refundAmount?bookingId=${bookingId}`,
    RESCHEDULE_CONFIRM:
      `/api/rescheduleConfirm`,
    COUPON_APPLY:"api/coupon/getAllCoupons",
    
  },

  PAYMENT: {
    CREATE_PAYMENT: "/api/createPayment",
    VERIFY_SIGNATURE: "/api/verifySignature",
    REVERT_BOOKING: (bookingId: string) =>
      `/api/revertBooking?bookingId=${bookingId}`,
  },

  FAQS: {
    GET_FAQS: "/api/get-all-faqs",
  },

  CARD: {
    GET_CARDDETAILS: "api/card/get-all-cards",
    SAVE_CARDDETAILS: "api/card/save-card",
  },
 ADMIN:{
   VEHICLE_UNAVAILABLE:(vehicleNumber: string,vendorCompanyName:string) =>`/api/getVehicleUnavailableDates?vehicleNumber=${vehicleNumber}&vendorCompanyName=${vendorCompanyName}`,
  UPDATE_AVAILABILITY:'/api/saveAvailability',
  FETCH_FILTER:"/api/fetchFilters",
  
 },
 DASHBOARD : {
  BUS_REVENUE: (vehicleNumber: string) =>
    `/api/bus-revenue?vehicleNumber=${vehicleNumber}`,
  GET_ALL_REVENUE:(status:string,year:number)=>`/api/allVehiclesRevenue?status=${status}&year=${year}`,
  TOP_RATED:"/api/topRevenueBuses",
},
REVIEW:{
  ADD_REVIEW: "/api/review/addReview",
  UPDATE_REVIEW: "/api/review/updateReview",
},
 
  

  VENDOR: {
    ADD_PROFILE: "/api/updateVendor",
    TRIP_STATUS: (bookingId: string, status: string) =>
      `/api/trip-status?bookingId=${bookingId}&status=${status}`,
  },

  DOWNLOAD_REPORT: (bookingId: string, reportType: string) =>
    `/api/report?reportType=${reportType}&bookingId=${bookingId}`,
};