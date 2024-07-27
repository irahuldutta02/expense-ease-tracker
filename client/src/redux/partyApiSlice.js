import { BACKEND_URL, PARTY_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const partyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParties: builder.query({
      query: () => ({
        url: BACKEND_URL + `${PARTY_URL}`,
        method: "GET",
      }),
    }),
    createParty: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${PARTY_URL}`,
        method: "POST",

        body: data,
      }),
    }),
    updateParty: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${PARTY_URL}/${id}`,
        method: "PUT",

        body: data,
      }),
    }),
    deleteParty: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${PARTY_URL}/${id}`,
        method: "DELETE",
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
