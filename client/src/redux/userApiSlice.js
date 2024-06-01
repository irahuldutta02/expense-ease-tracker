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
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: BACKEND_URL + `${USERS_URL}/logout`,
        method: "GET",
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/update`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/reset-password/${data.resetToken}`,
        method: "PATCH",
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice;
