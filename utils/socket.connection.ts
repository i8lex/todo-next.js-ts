import { io } from 'socket.io-client';
import * as process from 'process';

export const socket = io(process.env.NEXT_PUBLIC_BASE_API_URL || 'URL', {
  autoConnect: false,
  path: '',
});
