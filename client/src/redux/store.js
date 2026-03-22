import { configureStore } from "@reduxjs/toolkit";
import { VITE_NODE_ENV } from "../constants";
import { apiSlice } from "./apiSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: VITE_NODE_ENV === "development",
});

export default store;
