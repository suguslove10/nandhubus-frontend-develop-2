export interface TaxResponse {
    state: string;
    stateTax: number;
  }
  
  interface PriceBreakDown {
    basicFare: number;
    driverCharges: number;
    tollDetails: Record<string, any>; // adjust type if tollDetails has structure later
    tollCharges: number;
    gst: number;
    totalAmount: number;
    platFormFees: number;
    gstOnPlatformFees: number;
    taxResponses: TaxResponse[];
  }
  
  export interface VehicleCalculationResponse {
    vehicleNumber: string;
    priceBreakDown: PriceBreakDown;
  }

  
 export interface VehicleCalculationData {
    vehicleCalculationResponses: VehicleCalculationResponse[];
    overAllPriceBreakDown: PriceBreakDown;
  }
  