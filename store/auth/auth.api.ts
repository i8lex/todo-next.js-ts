import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import unfetch from "isomorphic-unfetch";

type RegistrationBody = {
  name: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type EmailRepeatBody = {
  email: string;
};

type EmailConfirmBody = {
  confirmId: string;
};

const baseQuery: BaseQueryFn<any, any> = async ({
  url,
  method,
  headers,
  body,
}) => {
  const response = await unfetch(url, {
    method,
    headers,
    body,
  });
  return response.json();
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (build) => ({
    registration: build.mutation<void, RegistrationBody>({
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
    emailConfirm: build.query<void, EmailConfirmBody>({
      query: (confirmId) => ({ url: `/email/?confirm=${confirmId}` }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useEmailRepeatMutation,
  useEmailConfirmQuery,
} = authApi;
