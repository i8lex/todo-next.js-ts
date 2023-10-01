import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetChatQuery } from '@/redux/api/chats.api';
import SendIcon from '@/public/IconsSet/send-01.svg';
import { setUsers } from '@/redux/slices/chat.slice';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { scroller } from 'react-scroll';
import { MessageCard } from '@/components/chats/MessageCard';
import { Spinner } from '@/components/ui/Spinner';
import useSocket from '@/utils/socket.connection';
type FormRequiredFields = {
  message: string;
};
export const Chat = () => {
  const { token, id: userId } = useAppSelector((state) => state.auth.session);
  const id = useAppSelector((state) => state.auth.session.id);
  const chatId = useAppSelector((state) => state.chats._id);
  const { data: chat, isSuccess } = useGetChatQuery(chatId!, {
    skip: !chatId,
    refetchOnMountOrArgChange: true,
  });

  const socket = useSocket(token, chatId);
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
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
      dispatch(setUsers(chat.users));
    }
  }, [chatId, isSuccess, chat]);

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

  useEffect(() => {
    if (chat?.messages) {
      const message = chat?.messages.find((message) => {
        return !message.readBy.includes(id);
      });
      scroller.scrollTo(message?._id ? message?._id : 'bottomOfList', {
        smooth: true,
        duration: 500,
        containerId: 'list',
      });
    }
  }, [chat?.messages.length]);
  return isSuccess && chat ? (
    <div className="relative overflow-y-scroll py-4 border flex flex-col gap-4 justify-between border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60 h-full">
      <div
        id={'list'}
        ref={scrollRef}
        className="flex  flex-col gap-3 tablet:h-full h-[90dvh] overflow-hidden border-b border-stroke mb-4 pb-4 overflow-y-scroll"
      >
        {chat.messages.map((msg) => (
          <MessageCard key={msg._id} message={msg} />
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
  ) : (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Spinner className={'text-green-60 fill-softGreen w-44 h-44'} />
    </div>
  );
};
