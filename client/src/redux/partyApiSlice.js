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
    createParty: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${PARTY_URL}`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    updateParty: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${PARTY_URL}/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    deleteParty: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${PARTY_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetPartiesQuery,
  useCreatePartyMutation,
  useDeletePartyMutation,
  useUpdatePartyMutation,
} = partyApiSlice;
