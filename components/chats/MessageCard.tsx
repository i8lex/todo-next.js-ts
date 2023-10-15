import clsx from 'clsx';
import { format, isToday, parseISO } from 'date-fns';
import CheckIcon from '@/public/IconsSet/check-square-broken.svg';
import React, { FC } from 'react';
import { Message } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { readMessages } from '@/redux/slices/chat.slice';
import { socket } from '@/utils/socket.connection';

import { InView } from 'react-intersection-observer';
import { chatsApi } from '@/redux/api/chats.api';

type MessageCardProps = {
  message: Partial<Message>;
};
export const MessageCard: FC<MessageCardProps> = ({ message }) => {
  const { name } = useAppSelector((state) => state.auth.session);
  const id = useAppSelector((state) => state.auth.session.id);
  const chatId = useAppSelector((state) => state.chat._id);
  const users = useAppSelector((state) => state.chat.users);
  const dispatch = useAppDispatch();

  return (
    <InView
      threshold={0.2}
      onChange={async (inView, entry) => {
        if (inView && entry) {
          const { id: elementId } = entry.target;
          dispatch(readMessages({ messageId: elementId, chatId, userId: id }));
          dispatch(
            // @ts-ignore
            chatsApi.util.updateQueryData(
              'getAllChats',
              undefined,
              (chatsData) => {
                chatsData.map((chat) => {
                  if (chat._id === chatId) {
                    chat.messages = chat.messages.filter(
                      (message) => message._id !== elementId,
                    );
                  }
                  return chat;
                });
              },
            ),
          );
          socket.emit('chatMessage', {
            messageId: elementId,
            chatId,
            userId: id,
            event: 'read',
            users,
          });
        }
      }}
    >
      {({ ref }) => (
        <div
          ref={!message?.readBy?.includes(id) ? ref : undefined}
          id={!message?.readBy?.includes(id) ? message._id : undefined}
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
            {message?.created ? (
              <p>
                {isToday(parseISO(message?.created))
                  ? 'Today'
                  : format(parseISO(message?.created), 'd MMM yyyy')}{' '}
                at {format(parseISO(message?.created), 'HH:mm')}
              </p>
            ) : null}
          </div>
          <div className="text-parS tablet:text-parL text-dark-100">
            {message.message}
          </div>
          <div className=" self-end w-2 h-2 tablet:w-4 tablet:h-4">
            {message.username === name ? (
              users.every((user) => message?.deliveredTo?.includes(user)) ? (
                <CheckIcon
                  className={clsx(
                    users.every((user) => message?.readBy?.includes(user))
                      ? 'text-green-100'
                      : 'text-gray-80',
                    'w-3 h-3 tablet:w-5 tablet:h-5',
                  )}
                />
              ) : (
                <div className=" tablet:border-[2px] border-[1px] border-gray-80 w-[11px] h-[11px] tablet:w-[18px] tablet:h-[18px] tablet:rounded-[4px] rounded-[2px]" />
              )
            ) : null}
          </div>
        </div>
      )}
    </InView>
  );
};
