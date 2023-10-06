import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { getSession } from 'next-auth/react';
import { Chat, Message } from '@/types';
import { TagDescription } from '@reduxjs/toolkit/dist/query/react';
import { socket } from '@/utils/socket.connection';

export type ChatDTO = {
  _id?: string;
  title?: string;
  user?: string;
  owner?: string;
  event?: string;
  task?: string;
  unRead?: number;
  messages: Message[];
  microtask?: string;
  users: string[];
  userNames?: string[];
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
        const { data: chat } = await cacheDataLoaded;

        const messageListener = async (message: Message) => {
          updateCachedData((draft) => {
            draft.messages.push(message);
          });
        };
        const isDeliveredListener = async (deliveredTo: string) => {
          updateCachedData((draft) => {
            draft.messages = draft.messages.map((message) => {
              if (!message.deliveredTo.includes(deliveredTo)) {
                socket.emit('isDeliveredMessage', {
                  messageId: message._id,
                  chatId: message.chatId,
                });
                message.deliveredTo.push(deliveredTo);
              }
              return message;
            });
          });
        };
        const isReadMessageListener = async (body: {
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
          socket.disconnect();

          socket.on('chatMessage', messageListener);
          socket.on('isDeliveredMessage', isDeliveredListener);
          socket.on('readMessage', isReadMessageListener);
          if (!socket?.connected) {
            socket.connect();
            socket.emit('join-room', chat._id);
          }
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

export const { useCreateChatMutation, useGetAllChatsQuery, useGetChatQuery } =
  chatsApi;
