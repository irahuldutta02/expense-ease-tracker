import { apiSlice } from "./apiSlice";
import { PARTY_URL } from "../constants";
import { BACKEND_URL } from "../constants";

export const partyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParties: builder.query({
      query: () => ({
        url: BACKEND_URL + `${PARTY_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetPartiesQuery } = partyApiSlice;