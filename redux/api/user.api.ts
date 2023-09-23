import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { getSession, SignInResponse } from 'next-auth/react';
import {
  BaseQueryApi,
  TagDescription,
} from '@reduxjs/toolkit/dist/query/react';
import { Event } from '@/types';

type PathInfoResponse = {
  message: string;
};

export type UsersDTO = UserDTO[];
export type UserDTO = {
  _id?: string;
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
  connects?: string[];
  isConnect?: string;
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
  tagTypes: ['User', 'Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders,
  }),
  endpoints: (build) => ({
    getUsers: build.query<UserDTO[], void>({
      query: () => 'users',
      providesTags: (
        result: UserDTO[] | undefined,
      ): (TagDescription<'Users'> | TagDescription<'User'>)[] =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User' as const, _id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),
    getConnectedUsers: build.query<UserDTO[], void>({
      query: () => 'users/connected',
      providesTags: (
        result: UserDTO[] | undefined,
      ): (TagDescription<'Users'> | TagDescription<'User'>)[] =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User' as const, _id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),
    pathInfo: build.mutation<PathInfoResponse, UserDTO>({
      query: (body) => ({
        url: '/user',
        method: 'POST',
        body,
      }),
    }),
    addRequestConnect: build.mutation<PathInfoResponse, string>({
      query: (id) => ({
        url: `/user/connect/${id}`,
        method: 'POST',
      }),
    }),
    deleteRequestConnect: build.mutation<PathInfoResponse, string>({
      query: (id) => ({
        url: `/user/connect/${id}`,
        method: 'DELETE',
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

export const {
  usePathInfoMutation,
  useGetMyInfoQuery,
  useLazyGetMyInfoQuery,
  useGetUsersQuery,
  useGetConnectedUsersQuery,
  useLazyGetConnectedUsersQuery,
  useLazyGetUsersQuery,
  useAddRequestConnectMutation,
  useDeleteRequestConnectMutation,
} = userApi;
