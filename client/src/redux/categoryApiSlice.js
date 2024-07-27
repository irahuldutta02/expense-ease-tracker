import { BACKEND_URL, CATEGORY_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: BACKEND_URL + `${CATEGORY_URL}`,
        method: "GET",
      }),
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${CATEGORY_URL}`,
        method: "POST",

        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${CATEGORY_URL}/${id}`,
        method: "PUT",

        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${CATEGORY_URL}/${id}`,
        method: "DELETE",
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
