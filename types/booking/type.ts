export interface Booking {
    bookingId: string;
    bookingDate: string;
    bookingStatus: string;
    vehicle: {
      vehicleNumber: string;
      seatCapacity: number;
      vehicleAC: string;
      sleeper: string;
    }[];
    user: {
      userId: string;
      firstName: string;
      middleName?: string | null;
      lastName: string;
      mobile?: string | null;
      email?: string | null;
      gender?: string | null;
      age?: number | null;
    };
    slots: {
      vehicleNumber?: string | null;
      fromDate: string;
      toDate: string;
    };
    advancedPaid?: number | null;
    totalAmt?: number | null;
    remainingAmt?: number | null;
  }
  
  // Define an array type separately
  export type BookingList = Booking[];
  