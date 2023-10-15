import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/types';
import { ChatDTO } from '@/redux/api/chats.api';

const initialState = {
  _id: '',
  user: '',
  users: [] as string[],
  messages: [] as Message[],
  chats: [] as ChatDTO[],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    deliverMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.map((message) => {
        if (!message.deliveredTo.includes(action.payload)) {
          message.deliveredTo.push(action.payload);
        }
        return message;
      });
    },
    readMessage: (
      state,
      action: PayloadAction<{ userId: string; messageId: string }>,
    ) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.messageId) {
          if (!message.readBy.includes(action.payload.userId)) {
            message.readBy.push(action.payload.userId);
          }
        }
        return message;
      });
    },
    setUsers: (state, action: PayloadAction<string[]>) => {
      state.users = [...action.payload];
    },
    setMessagesInitial: (state, action: PayloadAction<Message[]>) => {
      state.messages = [...action.payload];
    },
    addChatId: (state, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
    setChats: (state, action: PayloadAction<ChatDTO[]>) => {
      state.chats = action.payload;
    },
    addUnreadMessage: (
      state,
      action: PayloadAction<{
        users: string[];
        chatId: string;
        _id: string;
      }>,
    ) => {
      state.chats.map((chat) => {
        if (chat._id === action.payload.chatId) {
          chat.messages.push(action.payload);
        }
        return chat;
      });
    },
    readMessages: (
      state,
      action: PayloadAction<{
        userId: string;
        messageId: string;
        chatId: string;
      }>,
    ) => {
      state.chats = state.chats.map((chat) => {
        if (chat._id === action.payload.chatId) {
          chat.messages = chat.messages.filter((message) => {
            return message._id !== action.payload.messageId;
          });
        }
        return chat;
      });
    },
  },
});

export const {
  setChats,
  readMessages,
  addUnreadMessage,
  readMessage,
  setUsers,
  addChatId,
} = chatSlice.actions;
export default chatSlice.reducer;
