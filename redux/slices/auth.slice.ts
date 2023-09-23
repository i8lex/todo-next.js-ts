import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      action: PayloadAction<string>
    ) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setLogoutSuccess: (state: ResponseAuthType) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setLoginSuccess, setLogoutSuccess } = authSlice.actions;

// export const authReducer = authSlice.reducer;

export default authSlice.reducer;
