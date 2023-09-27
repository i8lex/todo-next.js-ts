import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (token: string, chatId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://192.168.1.9:3001', {
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
