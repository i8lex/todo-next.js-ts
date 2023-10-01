import { createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface WebSocketState {
  socket: Socket | null;
}

const initialState: WebSocketState = {
  socket: null,
};

const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setSocket } = webSocketSlice.actions;

export const selectSocket = (state: { webSocket: WebSocketState }) =>
  state.webSocket.socket;

export default webSocketSlice.reducer;
