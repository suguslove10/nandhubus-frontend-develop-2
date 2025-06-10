import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_CONSTANTS } from '../services/api.route';
import { PackageVehicleList } from '../types/package.list';
import { getRequest } from '../services/httpServices';


interface PackageVehicleState {
  vehicles: PackageVehicleList[];
  loading: boolean;
  error: string | null;
}

const initialState: PackageVehicleState = {
  vehicles: [],
  loading: false,
  error: null,
};

// Async thunk for fetching package vehicles
export const fetchPackageVehicles = createAsyncThunk(
    'packageVehicles/fetchPackageVehicles',
    async (
      {
        fromDate,
        packageName,
        source,
        sourceLatitude,
        sourceLongitude,
        isReschedule,
        bookingId,
      }: {
        fromDate: string;
        packageName: string;
        source: string;
        sourceLatitude: number;
        sourceLongitude: number;
        bookingId?: string;
        isReschedule?: boolean;
        isMultiReschedule?: boolean;
      },
      { rejectWithValue }
    ) => {
      try {
        const response = await getRequest(
          API_CONSTANTS.VEHICLE.GET_PACKAGE_VEHICLE(fromDate, packageName,source,sourceLatitude,sourceLongitude, isReschedule, bookingId, )
        );
        return response as PackageVehicleList[];
      } catch (error) {
        return rejectWithValue('Failed to fetch package vehicles');
      }
    }
  );
  

const packageVehicleSlice = createSlice({
  name: 'packageVehicles',
  initialState,
  reducers: {
    // You can add other synchronous actions here if needed
    clearPackageVehicles: (state) => {
      state.vehicles = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackageVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchPackageVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPackageVehicles } = packageVehicleSlice.actions;
export default packageVehicleSlice.reducer;