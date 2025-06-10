export interface PackageVehicleList {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  seatCapacity: number;
  includedPlaces: string[];
  excludedPlaces: ExcludedPlace[];
  s3ImageUrl: VehicleImage[];
  sleeper: string;
  advanceAmt: number;
  remainingAmt: number;
  isAmountRequired: boolean;
  advanceAmountNeedToPay: number;
  previousAdvanceAmountPaid: number;
  emergencyNumber: string | null;
  source: string;
  destination: string;
  rating: number;
  totalAmount: number;
  amenities: Amenity[];
  policies: Policy[];
  variants: VehicleVariant[];
  paymentType: string; // Added payment type field
}

export interface ExcludedPlace {
  place: string;
  price: number;
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
  policyData: PolicyMessage[];
}

interface PolicyMessage {
  id: string;
  policyMessage: string;
}

interface VehicleVariant {
  vehicleAC: string;
  totalAmount: number;
}