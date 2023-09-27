import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { getSession, SignInResponse } from 'next-auth/react';
import { Chat, Event, Message } from '@/types';
import { TagDescription } from '@reduxjs/toolkit/dist/query/react';

export type ChatDTO = {
  _id?: string;
  user?: string;
  owner?: string;
  event?: string;
  task?: string;
  unRead?: number;
  messages: Message[];
  microtask?: string;
  users: string[];
};

const prepareHeaders = async (headers: Headers) => {
  const session = await getSession();
  // @ts-ignore
  const token = session?.user?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};
export const chatsApi = createApi({
  reducerPath: 'chatsApi',
  tagTypes: ['Chats', 'Chat'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders,
  }),
  endpoints: (build) => ({
    getAllChats: build.query<ChatDTO[], void>({
      query: () => 'chats',
      providesTags: (
        result: ChatDTO[] | undefined,
      ): (TagDescription<'Chats'> | TagDescription<'Chat'>)[] =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Chat' as const, _id })),
              { type: 'Chats' as const, id: 'LIST' },
            ]
          : [{ type: 'Chats' as const, id: 'LIST' }],
    }),
    getChat: build.query<ChatDTO, string>({
      query: (id) => ({
        url: `chats/chat/${id}`,
        method: 'GET',
      }),
    }),
    readMessage: build.mutation<void, string>({
      query: (id: string) => ({
        url: `chats/chat/${id}`,
        method: 'PUT',
      }),
    }),
    createChat: build.mutation<ChatDTO, ChatDTO>({
      query: (body) => ({
        url: 'chats/chat/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetAllChatsQuery,
  useLazyGetAllChatsQuery,
  useGetChatQuery,
} = chatsApi;
