import { BACKEND_URL, EXPENSE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => ({
        url: BACKEND_URL + `${EXPENSE_URL}`,
        method: "GET",
      }),
    }),
    createExpense: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${EXPENSE_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),
    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: BACKEND_URL + `${EXPENSE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: BACKEND_URL + `${EXPENSE_URL}/${id}`,
        method: "DELETE",
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
