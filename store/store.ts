import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { authApi } from "./auth/auth.api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch as ThunkDispatch<any, any, any>);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
