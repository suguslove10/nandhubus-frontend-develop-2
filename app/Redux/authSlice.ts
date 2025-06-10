import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ILoginResponse } from "../types/loginResponse.type";
import { UserProfile } from "../types/profile.type";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export interface AuthState {
  user: ILoginResponse | null;
  isAuthenticated: boolean;
}

const clearUserTypeCookie = () => {
  deleteCookie("userType", { path: "/" });
  deleteCookie("authToken", { path: "/" });
};

const loadFromStorage = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  const user = sessionStorage.getItem("user");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const authToken = getCookie("authToken");

  return user && authToken
    ? { user: JSON.parse(user), isAuthenticated }
    : { user: null, isAuthenticated: false };
};

const initialState: AuthState = loadFromStorage();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(action.payload));
        sessionStorage.setItem("isAuthenticated", "true");

        const accessToken = action.payload.authTokenResponse?.accessToken || "";
        localStorage.setItem("accessToken", accessToken);
        setCookie("authToken", accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.removeItem("accessToken");
        clearUserTypeCookie();

        window.location.replace("/");
      }
    },

    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      if (state.user) {
        state.user.user = {
          ...state.user.user,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          mobile: action.payload.mobile,
          gender: action.payload.gender,
        };

        if (typeof window !== "undefined") {
          sessionStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { login, logout, updateUserProfile } = authSlice.actions;

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
