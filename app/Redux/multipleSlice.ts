import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bus } from "../types/list.response";

interface MultipleBusState {
  selectedBuses: Bus[];
}

const initialState: MultipleBusState = {
  selectedBuses: [],
};

const multipleBusSlice = createSlice({
  name: "multipleBusBooking",
  initialState,
  reducers: {
    updateSelectedBuses: (state, action: PayloadAction<Bus[]>) => {
      state.selectedBuses = action.payload;
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("selectedBuses", JSON.stringify(action.payload));
      }
    },
    loadSelectedBusesFromLocalStorage: (state) => {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedBuses = localStorage.getItem("selectedBuses");
        if (savedBuses) {
          state.selectedBuses = JSON.parse(savedBuses);
        }
      }
    },
  },
});

export const { updateSelectedBuses, loadSelectedBusesFromLocalStorage } =
  multipleBusSlice.actions;
export default multipleBusSlice.reducer;
