import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetChatQuery } from '@/redux/api/chats.api';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import useSocket from '@/utils/socket.connection';
import {
  addMessage,
  readMessage,
  setMessagesInitial,
} from '@/redux/slices/chat.slice';

export const Chat = () => {
  const {
    name,
    token,
    id: userId,
  } = useAppSelector((state) => state.auth.session);

  console.log(name, token, userId);
  ``;
  const chatId = useAppSelector((state) => state.chats._id);
  const messages = useAppSelector((state) => state.chats.messages);
  const { data: chat, isSuccess } = useGetChatQuery(chatId!, {
    skip: !chatId,
    refetchOnMountOrArgChange: true,
  });
  const socket = useSocket(token, chatId);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isSuccess && 'messages' in chat) {
      console.log(chat);
      dispatch(setMessagesInitial(chat.messages));
    }
  }, [chatId, isSuccess, chat]);

  useEffect(() => {
    if (socket && chatId) {
      console.log('connect');
      socket.on('chatMessage', (message) => {
        console.log(message);
        dispatch(addMessage(message));
        socket.emit('readMessage', { messageId: message._id, chatId });
      });

      return () => {
        socket.off('chatMessage');
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    if (socket && chatId) {
      socket.on('readMessage', (readBy) => {
        dispatch(readMessage(readBy.userId));
      });
      return () => {
        socket.off('readMessage');
      };
    }
  }, [socket, chatId]);

  const sendMessage = () => {
    if (socket) {
      socket.emit('chatMessage', {
        message,
        userId,
        chatId: chatId,
      });
      setMessage('');
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={clsx(msg.username === name ? 'self-end' : 'self-start')}
          >
            <div>{msg.username}</div>
            <div>{msg.message}</div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
