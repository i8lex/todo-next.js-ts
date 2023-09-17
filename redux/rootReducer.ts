import { combineReducers } from '@reduxjs/toolkit';
import taskSlice from './slices/tasks.slice';
import { tasksApi } from './api/tasks.api';
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
  tasks: taskSlice,
  image: imagesSlice,
  auth: persistReducer(authPersistConfig, authSlice),
  [authApi.reducerPath]: authApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
});

export default combinedReducer;
