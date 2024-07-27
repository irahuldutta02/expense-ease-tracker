/* eslint-disable no-unused-vars */
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../constants.js";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user?.userInfo?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["rtk-query"],

  endpoints: (builder) => ({}),
});
