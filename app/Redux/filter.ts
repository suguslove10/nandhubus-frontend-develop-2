import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFilteredData } from "../services/data.service";
import { Bus } from "../types/list.response";

interface VehicleRequestParams {
  fromDate: string;
  toDate: string;
  vehicleAC: string[];
  seaterType: string[];
}

interface VehicleDetailsState {
  data: Bus[]; 
  loading: boolean;
  error: string | null;
}

const initialState: VehicleDetailsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchVehicleDetailsData = createAsyncThunk<
  Bus[],
  VehicleRequestParams
>(
  "vehicleDetails/fetchData",
  async (params: VehicleRequestParams): Promise<Bus[]> => {
    try {
      const response = await fetchFilteredData(
        params.fromDate,
        params.toDate,
        params.vehicleAC,
        params.seaterType
      );
      return response as Bus[]; 
    } catch (error) {
      throw new Error("Failed to fetch vehicle details");
    }
  }
);

const vehicleDetailsSlice = createSlice({
  name: "vehicleDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleDetailsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleDetailsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchVehicleDetailsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vehicle details";
      });
  },
});

export const selectVehicleDetails = (state: {
  vehicleDetails: VehicleDetailsState;
}) => state.vehicleDetails;

export default vehicleDetailsSlice.reducer;
