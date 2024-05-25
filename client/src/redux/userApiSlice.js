import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { BACKEND_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: BACKEND_URL + `${USERS_URL}/logout`,
        method: "GET",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/update`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateUserProfileMutation,
} = userApiSlice;
