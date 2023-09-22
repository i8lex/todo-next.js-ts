import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { getSession, SignInResponse } from 'next-auth/react';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/react';

type PathInfoResponse = {
  message: string;
};

// export type GetMyInfoResponse = {
//   email: string;
//   firstname: string;
//   lastname: string;
//   birthday: string;
//   isBirthdayShowing: string;
//   gender: string;
//   isGenderShowing: string;
//   company: string;
//   isCompanyShowing: string;
//   role: string;
//   isRoleShowing: string;
//   about: string;
//   isAboutShowing: string;
//   connects: string[];
//   isConnectsShowing: string;
//   events: string[];
//   isEventsShowing: string;
//   avatar: {
//     name: string;
//     buffer: string;
//     mimeType: string;
//   };
// };

export type UserDTO = {
  name?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  isBirthdayShowing?: string;
  gender?: string;
  isGenderShowing?: string;
  company?: string;
  isCompanyShowing?: string;
  role?: string;
  isRoleShowing?: string;
  about?: string;
  isAboutShowing?: string;
  isConnectsShowing?: string;
  isEventsShowing?: string;
  avatar?: {
    name: string;
    buffer: string;
    mimeType: string;
  };
};
const prepareHeaders = async (
  headers: Headers,
  {
    getState,
  }: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>,
) => {
  // const token = (getState() as AuthState).auth.token;
  const session = await getSession();
  // @ts-ignore
  const token = session?.user?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};
export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User', 'Error'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders,
  }),
  endpoints: (build) => ({
    pathInfo: build.mutation<PathInfoResponse, UserDTO>({
      query: (body) => ({
        url: '/user',
        method: 'POST',
        body,
      }),
    }),
    getMyInfo: build.query<UserDTO, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
    }),
  }),
});

export const { usePathInfoMutation, useGetMyInfoQuery, useLazyGetMyInfoQuery } =
  userApi;
