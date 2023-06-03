import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth.api";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { authReducer, authSlice } from "./slices/auth.slice";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import tasksReducer from "./slices/tasks.slice";
import imageReducer from "./slices/images.slice";
import { tasksApi } from "./api/tasks.api";
import { imageApi } from "./api/images.api";

const authPersistConfig = {
  key: "authApi",
  storage,
  whitelist: ["token", "isAuthenticated"],
};

const rootReducer = {
  tasks: tasksReducer,
  image: imageReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
};

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(authApi.middleware, tasksApi.middleware, imageApi.middleware),
    ],
  });

  return store;
};

export const store = makeStore();

export const wrapper = createWrapper(makeStore);

// @ts-ignore
export type AppState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(makeStore());
