export interface VehiclePriceRequest {
    vehicleNumber: string;
    source: string;
    destination: string;
    startDate: string;
    endDate: string;
    baseFare: number;
  }
  
  export interface VehiclePriceSummaryRequest {
    requestList: VehiclePriceRequest[];
  }
  