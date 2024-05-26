import { apiSlice } from "./apiSlice";
import { EXPENSE_URL } from "../constants";
import { BACKEND_URL } from "../constants";

export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => ({
        url: BACKEND_URL + `${EXPENSE_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetExpensesQuery } = expenseApiSlice;
