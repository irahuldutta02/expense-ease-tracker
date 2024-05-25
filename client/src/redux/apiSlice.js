/* eslint-disable no-unused-vars */
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../constants.js";

const baseQuery = fetchBaseQuery({ baseUrl: BACKEND_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["rtk-query"],
  endpoints: (builder) => ({}),
});
