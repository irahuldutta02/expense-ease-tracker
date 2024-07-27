import { BACKEND_URL, USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: BACKEND_URL + `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.mutation({
      query: () => ({
        url: BACKEND_URL + `${USERS_URL}/me`,
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
  useGetMeMutation,
  useRegisterMutation,
  useUpdateUserProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice;
