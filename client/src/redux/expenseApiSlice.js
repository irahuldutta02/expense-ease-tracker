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
    createExpense: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${EXPENSE_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${EXPENSE_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${EXPENSE_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApiSlice;
