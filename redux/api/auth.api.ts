import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type RegistrationResponse = {
  message: string;
};
type RegistrationBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

// const baseQuery: BaseQueryFn<any, any> = fetchBaseQuery({
//   baseUrl: "http://localhost:3001/api",
// });

// export const authApi = createApi({
//   reducerPath: "authApi",
//   tagTypes: ["Authentications", "Error"],
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:3000/api",
//   }),
//   endpoints: (build) => ({
//     registration: build.mutation<RegistrationResponse, RegistrationBody>({
//       query: (body) => ({
//         url: "/registration",
//         method: "POST",
//         body,
//       }),
//     }),
//     login: build.mutation<void, LoginBody>({
//       query: (body) => ({
//         url: "/login",
//         method: "POST",
//         body,
//       }),
//     }),
//   }),
// });
//
// export const { useLoginMutation, useRegistrationMutation } = authApi;

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Authentications", "Error"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/" }),
  endpoints: (build) => ({
    registration: build.mutation({
      query: (body) => ({
        url: "/registration",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    emailRepeat: build.mutation({
      query: (body) => ({
        url: "/email",
        method: "PUT",
        body,
      }),
    }),
    emailConfirm: build.query({
      query: (confirmId) => `/email/?confirm=${confirmId}`,
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useEmailRepeatMutation,
  useEmailConfirmQuery,
} = authApi;
