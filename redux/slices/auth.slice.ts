import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SessionType = {
  session: {
    token: string;
    name: string;
    id: string;
    email: string;
    isConfirmed: boolean;
  };
};

const initialState: SessionType = {
  session: {
    token: '',
    name: '',
    id: '',
    email: '',
    isConfirmed: false,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
  },
});

export const { setSession } = authSlice.actions;

// export const authReducer = authSlice.reducer;

export default authSlice.reducer;
