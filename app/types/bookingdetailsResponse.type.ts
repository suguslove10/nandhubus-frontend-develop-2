interface PolicyData {
  id: string;
  policyMessage: string;
}

interface Policy {
  policyId: string;
  policyDescription: string;
  policyData: PolicyData[];
}

interface Vehicle {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  seatCapacity: number;
  vehicleAC: string;
  sleeper: string;
  s3ImageUrl: string[];
  amenities: string[];
  policies: Policy[];
   userReviewResponse: ReviewResponse; // Updated from string[] to Policy[]
}

interface User {
  userId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  mobile?: string | null;
  email: string;
  gender?: string | null;
  age?: number | null;
}

interface Slots {
  vehicleNumber: string | null;
  fromDate: string;
  toDate: string;
}

export interface PackageDetails {
  packageName: string;
  days: number;
  startingPrice: number;
  imageUrl: string;
  places?: string | null;
  packagePlaces?: string | null;
  excludedPlaces?: string[];
}
export interface ReviewAttribute {
  
  id: string;

  mediaUrl: string;
}

export interface ReviewResponse {
  reviewId: string;
  userName: string;
  rating: number;
  description: string;
  bookingId: string;
  vehicleId: string;
  createdAt: string; // ISO 8601 string, e.g., "2025-05-23T15:30:00"
  images: ReviewAttribute[];
  videos: ReviewAttribute[];
}


export interface BookingDetail {
  bookingId: string;
  bookingDate: string;
  bookingStatus: string;
  vehicle: Vehicle[];
  user: User;
  slots: Slots;
  source: string;
  refundAmount:number;
  couponApplied:boolean;
  destination: string;
  remainingAmt?: number | null;
  advancedPaid?: number | null;
  totalAmt?: number | null;
  packageDetails?: PackageDetails | null;
  packageBooking: boolean;
  paymentType: string;

  
}

export interface BookingResponse {
  enquiryList: BookingDetail[];
  bookedList: BookingDetail[];
  historyList: BookingDetail[];
  cancelledList: BookingDetail[];
}