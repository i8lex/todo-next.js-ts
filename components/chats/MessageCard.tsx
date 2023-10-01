import clsx from 'clsx';
import { format, isToday, parseISO } from 'date-fns';
import CheckIcon from '@/public/IconsSet/check-square-broken.svg';
import React, { FC } from 'react';
import { Message } from '@/types';
import { useAppSelector } from '@/redux/hooks';
import { readMessage } from '@/redux/slices/chat.slice';
import useSocket from '@/utils/socket.connection';

import { InView } from 'react-intersection-observer';

type MessageCardProps = {
  message: Message;
};
export const MessageCard: FC<MessageCardProps> = ({ message }) => {
  const { name, token } = useAppSelector((state) => state.auth.session);
  const id = useAppSelector((state) => state.auth.session.id);
  const chatId = useAppSelector((state) => state.chats._id);
  const socket = useSocket(token, chatId);
  const users = useAppSelector((state) => state.chats.users);

  const readMessageHandler = (messageId: string) => {
    if (socket) {
      socket.emit('readMessage', {
        messageId: messageId,
        chatId,
        userId: id,
        type: 'read',
      });
    }
  };

  return (
    <InView
      threshold={1}
      onChange={(inView, entry) => {
        if (inView && socket && entry) {
          const { id: elementId } = entry.target;
          socket.emit('readMessage', {
            messageId: elementId,
            chatId,
            userId: id,
          });
        }
      }}
    >
      {({ ref }) => (
        <div
          ref={!message.readBy.includes(id) ? ref : undefined}
          onClick={() => {
            readMessageHandler(message._id);
          }}
          id={!message.readBy.includes(id) ? message._id : undefined}
          className={clsx(
            message.username === name
              ? 'self-end bg-blue-10 shadow-blue-80 border-blue-80'
              : 'self-start bg-green-10 shadow-green-60 border-green-60 ',
            'relative flex break-words mx-4 flex-col gap-1 p-2 tablet:max-w-[320px] max-w-[27dvh] w-full shadow-inner  rounded-xl border ',
          )}
        >
          <div
            className={clsx(
              message.username === name ? 'text-blue-80' : 'text-green-60',
              'text-[8px]   tablet:text-parS w-full flex items-center justify-between font-semibold ',
            )}
          >
            <p className={'truncate'}>
              {message.username === name ? 'I am' : message.username}
            </p>
            <p>
              {isToday(parseISO(message.created))
                ? 'Today'
                : format(parseISO(message.created), 'd MMM yyyy')}{' '}
              at {format(parseISO(message.created), 'HH:mm')}
            </p>
          </div>
          <div className="text-parS tablet:text-parL text-dark-100">
            {message.message}
          </div>
          <div className=" self-end w-4 h-4">
            {message.username === name ? (
              users.every((user) => message.deliveredTo.includes(user)) ? (
                <CheckIcon
                  onClick={() => {
                    console.log(
                      'users',
                      users,
                      'deliver',
                      message.readBy,
                      users.every((user) => message.deliveredTo.includes(user)),
                    );
                  }}
                  className={clsx(
                    users.every((user) => message.readBy.includes(user))
                      ? 'text-green-100'
                      : 'text-gray-80',
                    'w-5 h-5',
                  )}
                />
              ) : (
                <div className=" border-[2px] border-gray-80 w-[18px] h-[18px] rounded-[4px]" />
              )
            ) : null}
          </div>
        </div>
      )}
    </InView>
  );
};
