import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import bookingReducer from "./bookingSlice";
import listVehiclesReducer from "./list";
import searchReducer from "./searchSlice";
import vehicleDetailsReducer from "./filter";
import busReducer from "./busSlice";
import multipleBusReducer from "./multipleSlice";
import packageVehicleReducer from './packagevehcleslice';


import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  booking: persistReducer(persistConfig, bookingReducer),
  listVehicles: persistReducer(persistConfig, listVehiclesReducer),
  search: persistReducer(persistConfig, searchReducer),
  vehicleDetails: persistReducer(persistConfig, vehicleDetailsReducer),
  bus: persistReducer(persistConfig, busReducer),
  multipleBusBooking: persistReducer(persistConfig, multipleBusReducer),
  packageVehicles: persistReducer(persistConfig,packageVehicleReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
