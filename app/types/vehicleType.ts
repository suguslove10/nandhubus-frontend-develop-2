export interface Amenity {
  amenityId: string;
  amenityName: string;
  amenitiesImageUrl: string;
}

export interface VehicleImage {
  vehicleImageId: string;
  vehicleImageUrl: string;
  vehicleImagePriority: number;
}

export interface Vehicle {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  vendorNumber: string;
  amtPerKM: number;
  mileage: number;
  seatCapacity: number;
  nightDriverBata:number;
  dayDriverBata:number;
  haltLocationAddress: string;
  vehicleStatus: string;
  filter: string;
  latitude?: string;
  longitude?: string;
  amenitiesResponses: Amenity[];
  vehicleImageDataResponses: VehicleImage[];
}
