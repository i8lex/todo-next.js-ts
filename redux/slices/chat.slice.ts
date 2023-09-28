import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message } from '@/types';

const initialState: Chat = {
  _id: '',
  user: '',
  users: [],
  messages: [] as Message[],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    readMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.map((message) => {
        if (!message.readBy.includes(action.payload)) {
          message.readBy.push(action.payload);
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
  },
});

export const {
  addMessage,
  readMessage,
  setUsers,
  setMessagesInitial,
  addChatId,
} = chatSlice.actions;
export default chatSlice.reducer;
