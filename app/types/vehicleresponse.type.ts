interface Amenity {
    id: number;
    amenityName: string;
    iconImage: string;
    vehicleId: number;
  }
  
   export interface HaltLocation {
    latitude: number;
    longitude: number;
    haltLocation: string | null;
  }
  
   export interface Vehicle {
    vehicleId: string;
    vehicleName: string;
    vehicleNumber: string;
    seatCapacity: number;
    s3ImageUrl: string[];
    vehicleAC: string;
    sleeper: string;
    image: string | null;
    emergencyNumber: string | null;
    totalAmount: number | null;
    advanceAmt: number | null;
    remainingAmt: number | null;
    amtPerKM: number;
    source: string | null;
    destination: string | null;
    haltLocation: string | null;
    haltLocations: HaltLocation;
    rating: number;
    price: number | null;
    mileage: number;
    amenities: Amenity[];
    policies: any[]; // Assuming an empty array, but you can change this based on the structure of policies
  }