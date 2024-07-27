import { BACKEND_URL, MODE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const modeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModes: builder.query({
      query: () => ({
        url: BACKEND_URL + `${MODE_URL}`,
        method: "GET",
      }),
    }),
    createMode: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${MODE_URL}`,
        method: "POST",

        body: data,
      }),
    }),
    updateMode: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${MODE_URL}/${id}`,
        method: "PUT",

        body: data,
      }),
    }),
    deleteMode: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${MODE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetModesQuery,
  useCreateModeMutation,
  useDeleteModeMutation,
  useUpdateModeMutation,
} = modeApiSlice;
