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
import { authSlice } from "./slices/auth.slice";
import { createWrapper } from "next-redux-wrapper";

const authPersistConfig = {
  key: "authApi",
  storage,
  whitelist: ["token", "isAuthenticated"],
};

export function makeStore() {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      auth: persistReducer(authPersistConfig, authSlice.reducer),
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(authApi.middleware),
    ],
  });
}

export const store = makeStore();
export const wrapper = createWrapper(makeStore);
export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   AppState,
//   unknown,
//   Action<string>
// >;

export const persistor = persistStore(store);
