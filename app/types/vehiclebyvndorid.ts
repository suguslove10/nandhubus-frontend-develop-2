export interface Vehicle {
    vehicleId: string | null;
    vehicleName: string;
    vehicleNumber: string;
    seatCapacity: number;
    s3ImageUrl: VehicleImage[];
    vehicleAC: string;
    sleeper: string;
    image: string | null;
    emergencyNumber: string | null;
    totalAmount: number | null;
    advanceAmt: number | null;
    remainingAmt: number | null;
    isAmountRequired: boolean | null;
    advanceAmountNeedToPay: number | null;
    previousAdvanceAmountPaid: number | null;
    amtPerKM: number;
    source: string | null;
    destination: string | null;
    haltLocation: string | null;
    rating: number | null;
    price: number | null;
    mileage: number;
    isFastTagAvailable: boolean;
    amenities: string | null;
    policies: VehiclePolicy[];
  }
  export interface VehicleImage {
    vehicleImageId: string;
    vehicleImageUrl: string;
    vehicleImagePriority: number;
  }
  export interface VehiclePolicy {
    policyId: string;
    policyDescription: string;
    policyData: PolicyMessage[];
  }
  export interface PolicyMessage {
    id: string;
    policyMessage: string;
  }
  
  
  
  