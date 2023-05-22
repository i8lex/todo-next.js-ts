import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type RegistrationResponse = {
  message: string;
};
export type RegistrationBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

type EmailRepeatBody = {
  email: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Authentications", "Error"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),
  endpoints: (build) => ({
    registration: build.mutation<RegistrationResponse, RegistrationBody>({
      query: (body) => ({
        url: "/registration",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation<void, LoginBody>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    emailRepeat: build.mutation<void, EmailRepeatBody>({
      query: (body) => ({
        url: "/email",
        method: "PUT",
        body,
      }),
    }),
    emailConfirm: build.query<void, string>({
      query: (confirmId) => `/email/?confirm=${confirmId}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useEmailConfirmQuery,
  useEmailRepeatMutation,
} = authApi;
