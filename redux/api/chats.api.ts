import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { getSession } from 'next-auth/react';
import { Chat, Message } from '@/types';
import { TagDescription } from '@reduxjs/toolkit/dist/query/react';
import { io } from 'socket.io-client';

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

export const useSocket = (token: string, chatId?: string) => {
  return io(process.env.NEXT_PUBLIC_BASE_API_URL || 'URL', {
    query: { room: chatId },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
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

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const session = await getSession();
        // @ts-ignore
        const token = session?.user?.token;
        const data = await cacheDataLoaded;
        const { _id: chatId } = data.data;
        const socket = useSocket(token, chatId);
        const messageListener = (message: Message) => {
          updateCachedData((draft) => {
            draft.messages.push(message);
            socket.emit('isDeliveredMessage', {
              messageId: message._id,
              chatId,
            });
          });
        };
        const isDeliveredListener = (deliveredTo: string) => {
          updateCachedData((draft) => {
            draft.messages = draft.messages.map((message) => {
              if (!message.deliveredTo.includes(deliveredTo)) {
                message.deliveredTo.push(deliveredTo);
              }
              return message;
            });
          });
        };
        const isReadMessageListener = (body: {
          userId: string;
          messageId: string;
        }) => {
          updateCachedData((draft) => {
            draft.messages = draft.messages.map((message) => {
              if (message._id === body.messageId) {
                if (!message.readBy.includes(body.userId)) {
                  message.readBy.push(body.userId);
                }
              }
              return message;
            });
          });
        };

        try {
          socket.on('chatMessage', messageListener);
          socket.on('isDeliveredMessage', isDeliveredListener);
          socket.on('readMessage', isReadMessageListener);
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        socket.off('chatMessage');
        socket.off('isDeliveredMessage');
        socket.off('readMessage');
        socket.disconnect();
      },
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

  useGetChatQuery,
} = chatsApi;
