import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as process from 'process';
import { getSession } from 'next-auth/react';
import { Chat, Message } from '@/types';
import { socket } from '@/utils/socket.connection';
import { setChats } from '@/redux/slices/chat.slice';
import { TagDescription } from '@reduxjs/toolkit/dist/query/react';

export type ChatDTO = {
  _id?: string;
  title?: string;
  user?: string;
  owner?: string;
  event?: string;
  task?: string;
  unRead?: number;
  messages: Partial<Message>[];
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

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const { data: chats } = await cacheDataLoaded;

        chats.forEach((chat) => {
          chat.messages.forEach((message) => {
            socket.emit('chatMessage', {
              messageId: message._id,
              chatId: chat._id,
              event: 'deliver',
              users: chat.users,
            });
          });
        });
        const messageListener = async (message: {
          _id: string;
          chatId: string;
          users: string[];
        }) => {
          updateCachedData((draft) => {
            socket.emit('chatMessage', {
              messageId: message._id,
              chatId: message.chatId,
              event: 'deliver',
              users: message.users,
            });
            draft.map((chat) => {
              if (chat._id === message.chatId) {
                chat.messages.push({ _id: message._id });
              }
              return chat;
            });
          });
        };
        try {
          socket.on('counter', messageListener);
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        socket.off('counter');
      },
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
        const { id: userId }: { id: string } = { ...session?.user };
        const { data: chat } = await cacheDataLoaded;
        chat.messages.forEach((message) => {
          if (!message.deliveredTo?.includes(userId)) {
            socket.emit('chatMessage', {
              messageId: message._id,
              chatId: chat._id,
              event: 'deliver',
              users: chat.users,
            });
          }
        });

        const messageListener = async (body: Message) => {
          if (!body.event) {
            return updateCachedData((draft) => {
              draft.messages.push(body);
            });
          } else if (body.event === 'deliver') {
            return updateCachedData((draft) => {
              draft.messages = draft.messages.map((message) => {
                if (!message?.deliveredTo?.includes(body.userId)) {
                  message?.deliveredTo?.push(body.userId);
                }
                return message;
              });
            });
          } else if (body.event === 'read') {
            return updateCachedData((draft) => {
              draft.messages = draft.messages.map((message) => {
                if (
                  message._id === body.messageId &&
                  !message?.readBy?.includes(body.userId)
                ) {
                  message?.readBy?.push(body.userId);
                }
                return message;
              });
            });
          }
        };

        try {
          socket.on('chatMessage', messageListener);
          // socket.emit('join-room', chat._id);
        } catch (err) {
          console.log(err);
        }
        await cacheEntryRemoved;
        // socket.emit('leave-room', chat._id);
        socket.off('chatMessage');
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
  useGetAllChatsQuery,
  useLazyGetAllChatsQuery,
  useGetChatQuery,
} = chatsApi;
