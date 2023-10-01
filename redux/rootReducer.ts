import { combineReducers } from '@reduxjs/toolkit';
import eventsSlice from './slices/events.slice';
import { eventsApi } from './api/events.api';
import { authApi } from './api/auth.api';
import imagesSlice from './slices/images.slice';
import chatsSlice from './slices/chat.slice';
import { imageApi } from '@/redux/api/images.api';
import { userApi } from '@/redux/api/user.api';
import { chatsApi } from '@/redux/api/chats.api';
import authSlice from '@/redux/slices/auth.slice';
import socketSlice from '@/redux/slices/socket.slice';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const combinedReducer = combineReducers({
  auth: authSlice,
  events: eventsSlice,
  image: imagesSlice,
  chats: chatsSlice,
  webSocket: socketSlice,
  [userApi.reducerPath]: userApi.reducer,
  [chatsApi.reducerPath]: chatsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [eventsApi.reducerPath]: eventsApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
});

export default combinedReducer;
