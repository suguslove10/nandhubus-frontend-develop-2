import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkVehicleAvailability } from "../services/data.service";
import { Bus } from "../types/list.response";

interface ListVehiclesParams {
  source: string;
  destination: string;
  fromDate: string;
  toDate: string;
  distanceInKm:number;
  sourceLatitude:number,
  sourceLongitude:number,
  destinationLatitude:number,
  destinationLongitude:number,
  tripExtraDays:number,
  isReschedule?: boolean;
  isMultiReschedule?:boolean;
  bookingId?: string;
  
}

interface ListVehiclesState {
  data: Bus[];
  loading: boolean;
  error: string | null;
}

const initialState: ListVehiclesState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchListVehiclesData = createAsyncThunk<
  Bus[],
  ListVehiclesParams
>(
  "listVehicles/fetchData",
  async (params: ListVehiclesParams): Promise<Bus[]> => {
    try {
      const response = await checkVehicleAvailability(
        params.source,
        params.destination,
        params.fromDate,
        params.toDate,
        params.distanceInKm,
        params.sourceLatitude!,
        params.sourceLongitude!,
        params.destinationLatitude!,
        params.destinationLongitude!,
        params.tripExtraDays!,
        params.isReschedule,
        params.isMultiReschedule,
        params.bookingId
      );

      return response as Bus[];
    } catch (error) {
      throw new Error("Failed to fetch vehicle data");
    }
  }
);

const listVehiclesSlice = createSlice({
  name: "listVehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListVehiclesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListVehiclesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchListVehiclesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export const selectListVehicles = (state: {
  listVehicles: ListVehiclesState;
}) => state.listVehicles;

export default listVehiclesSlice.reducer;
