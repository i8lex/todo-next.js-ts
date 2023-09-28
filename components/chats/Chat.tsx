import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetChatQuery } from '@/redux/api/chats.api';
import SendIcon from '@/public/IconsSet/send-01.svg';
import clsx from 'clsx';
import useSocket from '@/utils/socket.connection';
import {
  addMessage,
  readMessage,
  setMessagesInitial,
  setUsers,
} from '@/redux/slices/chat.slice';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { format, parseISO, isToday } from 'date-fns';
import { scroller } from 'react-scroll';
import CheckIcon from '@/public/IconsSet/check-square-broken.svg';
type FormRequiredFields = {
  message: string;
};
export const Chat = () => {
  const {
    name,
    token,
    id: userId,
  } = useAppSelector((state) => state.auth.session);

  const chatId = useAppSelector((state) => state.chats._id);
  const messages = useAppSelector((state) => state.chats.messages);
  const { data: chat, isSuccess } = useGetChatQuery(chatId!, {
    skip: !chatId,
    refetchOnMountOrArgChange: true,
  });
  const socket = useSocket(token, chatId);
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const users = useAppSelector((state) => state.chats.users);
  const {
    register,
    reset,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormRequiredFields>();
  useEffect(() => {
    if (isSuccess && 'messages' in chat) {
      dispatch(setMessagesInitial(chat.messages));
      dispatch(setUsers(chat.users));
    }
  }, [chatId, isSuccess, chat]);

  useEffect(() => {
    if (socket && chatId) {
      socket.on('chatMessage', (message) => {
        dispatch(addMessage(message));
        socket.emit('readMessage', { messageId: message._id, chatId });
      });

      return () => {
        socket.off('chatMessage');
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    scroller.scrollTo('bottomOfList', {
      smooth: true,
      duration: 500,
      containerId: 'list',
    });
  }, [messages]);

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
        message: getValues('message'),
        userId,
        chatId: chatId,
      });
      reset();
    }
  };

  return (
    <div className="relative overflow-y-scroll py-4 border flex flex-col gap-4 justify-between border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60 h-full">
      <div
        id={'list'}
        ref={scrollRef}
        className="flex  flex-col gap-3 tablet:h-full h-[90dvh] overflow-hidden border-b border-stroke mb-4 pb-4 overflow-y-scroll"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={clsx(
              msg.username === name
                ? 'self-end bg-blue-10 shadow-blue-80 border-blue-80'
                : 'self-start bg-green-10 shadow-green-60 border-green-60 ',
              'relative flex break-words mx-4 flex-col gap-1 p-2 tablet:max-w-[320px] max-w-[27dvh] w-full shadow-inner  rounded-xl border ',
            )}
          >
            <div
              className={clsx(
                msg.username === name ? 'text-blue-80' : 'text-green-60',
                'text-[8px]   tablet:text-parS w-full flex items-center justify-between font-semibold ',
              )}
            >
              <p className={'truncate'}>
                {msg.username === name ? 'I am' : msg.username}
              </p>
              <p>
                {isToday(parseISO(msg.created))
                  ? 'Today'
                  : format(parseISO(msg.created), 'd MMM yyyy')}{' '}
                at {format(parseISO(msg.created), 'HH:mm')}
              </p>
            </div>
            <div className="text-parS tablet:text-parL text-dark-100">
              {msg.message}
            </div>
            <div className=" self-end w-4 h-4">
              {msg.username === name ? (
                <CheckIcon
                  onClick={() => {
                    console.log(
                      'users',
                      users,
                      'msgReadBy',
                      msg.readBy,
                      users.every((user) => msg.readBy.includes(user)),
                    );
                  }}
                  className={clsx(
                    users.every((user) => msg.readBy.includes(user))
                      ? 'text-green-100'
                      : 'text-gray-80',
                    'w-4 h-4',
                  )}
                />
              ) : null}
            </div>
          </div>
        ))}
        <div id="bottomOfList" />
      </div>

      <form
        onSubmit={handleSubmit(sendMessage)}
        noValidate
        method="post"
        className="flex tablet:flex-row flex-col gap-6 tablet:gap-4  items-center px-4 justify-between tablet:justify-start w-full"
      >
        <Input
          label={'Enter your message'}
          isRequired={true}
          type="text"
          as={'textarea'}
          id="message"
          control={control}
          className="tablet:!h-[260px]"
          errorText={errors?.message?.message}
          {...register('message', {
            required: 'Message is required',
          })}
        />

        <Button
          variant="green"
          className="h-fit w-full tablet:w-fit"
          icon={{ svg: <SendIcon /> }}
        />
      </form>
    </div>
  );
};
