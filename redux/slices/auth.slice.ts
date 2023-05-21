import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

export type ResponseAuthType = {
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: ResponseAuthType = {
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoginSuccess: (
      state: ResponseAuthType,
      action: PayloadAction<ResponseAuthType>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { setLoginSuccess } = authSlice.actions;

export const selectAuthData = (state: AppState) => state.auth;

export const authReducer = authSlice.reducer;
