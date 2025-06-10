import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bus } from "../types/list.response";

interface BusState {
  selectedBus: Bus | null;
}

const initialState: BusState = {
  selectedBus: null,
};

const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    setSelectedBus: (state, action: PayloadAction<Bus | null>) => {
      state.selectedBus = action.payload;
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("selectedBus", JSON.stringify(action.payload));
      }
    },
    loadSelectedBusFromLocalStorage: (state) => {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedBus = localStorage.getItem("selectedBus");
        if (savedBus) {
          state.selectedBus = JSON.parse(savedBus);
        }
      }
    },
  },
});

export const { setSelectedBus, loadSelectedBusFromLocalStorage } =
  busSlice.actions;
export default busSlice.reducer;
