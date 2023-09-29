import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { SignInResponse } from 'next-auth/react';

type RegistrationResponse = {
  message: string;
  email: string;
};

export type RegistrationBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = SignInResponse & {
  token: string;
  message: string;
  confirmed: boolean;
};

type EmailRepeatBody = {
  email: string;
  name?: string;
  token?: string;
};
export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Authentications', 'Error'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL,
  }),
  endpoints: (build) => ({
    registration: build.mutation<RegistrationResponse, RegistrationBody>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: build.mutation<LoginResponse, LoginBody>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: JSON.stringify(body),
      }),
    }),

    emailRepeat: build.mutation<EmailRepeatBody, EmailRepeatBody>({
      query: (body) => ({
        url: '/auth/confirm/repeat',
        method: 'POST',
        body,
      }),
    }),
    emailConfirm: build.query<{ message: string; email: string }, string>({
      query: (confirmId) => `/auth/confirm/${confirmId}`,
    }),
  }),
});

export const {
  useRegistrationMutation,
  useEmailConfirmQuery,
  useEmailRepeatMutation,
} = authApi;
