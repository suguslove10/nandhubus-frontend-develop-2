import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  source: string;
  destination: string;
  fromDate: string;
  toDate: string;
}

const getInitialState = (): SearchState => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("searchState");
    return savedState
      ? JSON.parse(savedState)
      : { source: "", destination: "", fromDate: "", toDate: "" };
  }
  return { source: "", destination: "", fromDate: "", toDate: "" };
};

const initialState: SearchState = getInitialState();

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchDetails: (state, action: PayloadAction<SearchState>) => {
      state.source = action.payload.source;
      state.destination = action.payload.destination;
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;

      if (typeof window !== "undefined") {
        localStorage.setItem("searchState", JSON.stringify(state));
      }
    },
    clearSearchDetails: (state) => {
      state.source = "";
      state.destination = "";
      state.fromDate = "";
      state.toDate = "";

      if (typeof window !== "undefined") {
        localStorage.removeItem("searchState");
      }
    },
  },
});

export const { setSearchDetails, clearSearchDetails } = searchSlice.actions;
export default searchSlice.reducer;
