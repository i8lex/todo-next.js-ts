import { combineReducers } from '@reduxjs/toolkit';
import eventsSlice from './slices/events.slice';
import { eventsApi } from './api/events.api';
import { persistReducer, persistStore } from 'redux-persist';
import authSlice from './slices/auth.slice';
import { authApi } from './api/auth.api';
import imagesSlice from './slices/images.slice';
import { imageApi } from '@/redux/api/images.api';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

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

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const authPersistConfig = {
  key: 'authApi',
  storage,
  whitelist: ['token', 'isAuthenticated'],
};

const combinedReducer = combineReducers({
  events: eventsSlice,
  image: imagesSlice,
  auth: persistReducer(authPersistConfig, authSlice),
  [authApi.reducerPath]: authApi.reducer,
  [eventsApi.reducerPath]: eventsApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
});

export default combinedReducer;
