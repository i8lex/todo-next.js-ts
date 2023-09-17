import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { SignInResponse } from 'next-auth/react';

type RegistrationResponse = {
  message: string;
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

export type LoginResponse = {
  token: string;
  message: string;
  confirmed: boolean;
};

type EmailRepeatBody = {
  email: string;
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
        url: '/registration',
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
    emailRepeat: build.mutation<void, EmailRepeatBody>({
      query: (body) => ({
        url: '/email',
        method: 'PUT',
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
