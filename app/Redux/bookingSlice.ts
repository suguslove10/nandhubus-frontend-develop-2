import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  bookingId: string | null;
  mobile: string | null;
  totalAmount: number | null;
}

const initialState: BookingState = {
  bookingId: null,
  mobile: null,
  totalAmount: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingDetails: (
      state,
      action: PayloadAction<{ bookingId: string; mobile: string; totalAmount: number }>
    ) => {
      state.bookingId = action.payload.bookingId;
      state.mobile = action.payload.mobile;
      state.totalAmount = action.payload.totalAmount;
    },
    clearBookingDetails: (state) => {
      state.bookingId = null;
      state.mobile = null;
      state.totalAmount = null;
    },
  },
});

export const { setBookingDetails, clearBookingDetails } = bookingSlice.actions;
export default bookingSlice.reducer;
