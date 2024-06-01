import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";
import { BACKEND_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: BACKEND_URL + `${CATEGORY_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${CATEGORY_URL}`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${CATEGORY_URL}/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${CATEGORY_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApiSlice;
