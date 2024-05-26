import { apiSlice } from "./apiSlice";
import { MODE_URL } from "../constants";
import { BACKEND_URL } from "../constants";

export const modeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModes: builder.query({
      query: () => ({
        url: BACKEND_URL + `${MODE_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetModesQuery } = modeApiSlice;
