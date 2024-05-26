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
  }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;
