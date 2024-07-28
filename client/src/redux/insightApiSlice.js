import { BACKEND_URL, INSIGHT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const insightApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInsight: builder.query({
      query: ({ formDate, toDate }) => ({
        url:
          BACKEND_URL +
          `${INSIGHT_URL}` +
          `/insights?startDate=${formDate}&endDate=${toDate}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetInsightQuery } = insightApiSlice;
