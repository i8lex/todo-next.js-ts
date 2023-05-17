import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./auth/auth.api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch as ThunkDispatch<any, any, any>);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
