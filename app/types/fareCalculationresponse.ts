export interface FareCalculationResponse {
  basicFare: number;
  driverCharges: number;
  tollDetails: {
    [tollName: string]: number;
  };
  tollCharges: number;
  gst: number;
  totalAmount: number;
  platFormFees: number;
  gstOnPlatformFees: number;
  taxResponses: {
    state: string;
    stateTax: number;
  }[];
}
