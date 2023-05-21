import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { ResponseAuthType } from "../slices/auth.slice";

type RegistrationResponse = {
  message: string;
};
type RegistrationBody = {
  name: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

const baseQuery: BaseQueryFn<any, any> = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
});

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery,
  endpoints: (build) => ({
    registration: build.mutation<RegistrationResponse, RegistrationBody>({
      query: (body) => ({
        url: "/registration",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation<ResponseAuthType, LoginBody>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegistrationMutation } = authApi;
