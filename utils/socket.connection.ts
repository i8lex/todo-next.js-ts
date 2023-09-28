import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import * as process from 'process';

const useSocket = (token: string, chatId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_BASE_API_URL || 'URL', {
      query: { room: chatId },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chatId, token]);

  return socketRef.current;
};

export default useSocket;
