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
    createMode: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${MODE_URL}`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    updateMode: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${MODE_URL}/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    deleteMode: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${MODE_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
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
