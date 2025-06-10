export interface VehicleDto {
  vehicleId: string | null;
  vehicleName: string;
  vehicleNumber: string;
  seatCapacity: number;
  s3ImageUrl: VehicleImage[];
  vehicleAC: string | null;
  sleeper: string;
  image: string | null;
  emergencyNumber: string | null;
  totalAmount: number | null;
  advanceAmt: number | null;
  remainingAmt: number | null;
  isAmountRequired: boolean | null;
  advanceAmountNeedToPay: number;
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
  priceBreakDown: PriceBreakDown;
}

interface VehicleImage {
  vehicleImageId: string;
  vehicleImageUrl: string;
  vehicleImagePriority: number;
}

interface Amenity {
  amenityId: string;
  amenityName: string;
  amenitiesImageUrl: string;
}

interface Policy {
  policyId: string;
  policyDescription: string;
  policyData: PolicyData[];
}

interface PolicyData {
  id: string;
  policyMessage: string;
}

interface PriceBreakDown {
  basicFare: number;
  tollDetails: Record<string, unknown>;
  tollCharges: number;
  gst: number;
  totalAmount: number;
  driverCharges: number;
}
