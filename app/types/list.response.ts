interface Amenity {
  amenityId: string;
  amenityName: string;
  amenitiesImageUrl: string;
}

interface PolicyDataItem {
  id: string;
  policyMessage: string;
}

interface Policy {
  policyId: string;
  policyDescription: string;
  policyData: PolicyDataItem[];
}

interface VehicleImage {
  vehicleImageId: string;
  vehicleImageUrl: string;
  vehicleImagePriority: number;
}

 export interface PriceBreakDown {
  basicFare: number;
  tollDetails: { [key: string]: number };
  gst: number;
  totalAmount: number;
  tollCharges: number;
  driverCharges: number;
  vendorAmount:string | null;
}

export interface Bus {
  vehicleId: string | null;
  vehicleName: string;
  vehicleNumber: string;
  seatCapacity: number;
  s3ImageUrl: VehicleImage[];
  vehicleAC: string;
  sleeper: string | null;
  image: string | null;
  emergencyNumber: string | null;
  totalAmount: number | null;
  advanceAmt: number | null;
  remainingAmt: number | null;
  isAmountRequired: boolean | null;
  advanceAmountNeedToPay: number;
  paymentType: string;
  previousAdvanceAmountPaid: number | null;
  amtPerKM: number | null;
  source: string | null;
  destination: string | null;
  haltLocation: string | null;
  rating: number | null;
  price: number;
  mileage: number | null;
  isFastTagAvailable: boolean;
  amenities: Amenity[];
  policies: Policy[];
 reviewResponse:ReviewResponse;
  priceBreakDown: PriceBreakDown;
}
interface ReviewAttribute {
  // Define fields based on what's inside ReviewAttribute
  // Example placeholder fields:
 mediaUrl: string;
  id: string;
}

interface Review {
  reviewId: string;
  userName: string;
  rating: number;
  description: string;
  bookingId: string;
  vehicleId: string;
  createdAt: string; // ISO string; can convert to Date if needed
  images: ReviewAttribute[];
  videos: ReviewAttribute[];
}

export interface ReviewResponse {
  vehicleId: string;
  reviews: Review[];
  reviewAverage: number;
  totalNumberOfReviews: number;
} 