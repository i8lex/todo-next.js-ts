import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import clsx from 'clsx';

import LogOutIcon from '@/public/IconsSet/log-out-01.svg';

import type { Page } from '@/types';
import type { FC } from 'react';
import { useEffect } from 'react';
import { socket } from '@/utils/socket.connection';
import { useGetAllChatsQuery } from '@/redux/api/chats.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setChats } from '@/redux/slices/chat.slice';

export type GeneralHeaderProps = {
  currentPage: Page;
};

export const GeneralHeader: FC<GeneralHeaderProps> = ({ currentPage }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: sessionData } = useSession();
  const { data: chats, isSuccess } = useGetAllChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const chatsFromStore = useAppSelector((state) => state.chat.chats);
  const user = { ...sessionData?.user };
  //@ts-ignore
  const { token } = user;
  const links: Array<{ id: Page; href: string; name: string }> = [
    { id: 'my', href: '/my', name: 'My page' },
    { id: 'events', href: '/events', name: 'Events' },
    { id: 'users', href: '/users', name: 'Users' },
  ];
  useEffect(() => {
    if (!socket?.connected) {
      socket.io.opts.extraHeaders = {
        Authorization: `Bearer ${token}`,
      };
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chats && isSuccess) {
      dispatch(setChats(chats));
    }
  }, [chats, isSuccess]);

  const getUnreadMessagesQuantity = () => {
    return chatsFromStore.reduce((acc, chat) => {
      return acc + chat.messages.length;
    }, 0);
  };

  return (
    <header className="flex justify-center bg-softGreen px-4 py-2 tablet:px-6">
      <nav className="flex w-full items-center p-0 gap-6 desktop:gap-16">
        <Link
          href={'/'}
          className="focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80"
        >
          {/*<Logo className="w-6 tablet:w-7" />*/}Logo here
        </Link>
        <div className=" desktop:space-x-8 space-x-4 text-quot font-medium flex desktop:text-parS">
          {links.map(({ id, name, href }) => {
            const isCurrent = id === currentPage;
            return (
              <Link
                key={id}
                className={clsx(
                  'relative rounded-md py-1 px-2 focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80',
                  isCurrent
                    ? 'bg-white shadow-sm shadow-dark-60 text-darkSkyBlue-90 '
                    : 'bg-softGreen shadow-md shadow-dark-60 text-darkSkyBlue-60 hover:shadow-sm hover:shadow-dark-60 hover:bg-darkSkyBlue-20',
                )}
                href={href}
              >
                <div>{name}</div>
                {id === 'my' && getUnreadMessagesQuantity() > 0 ? (
                  <div className="absolute -right-1 -top-1 text-errorText text-[10px]  p-1 w-4 h-4 flex justify-center items-center text-darkSkyBlue-60 shadow-inner shadow-dark-60 bg-white  rounded-full">
                    {/*<div className="bg-error-100 w-1 h-1 rounded-full animate-ping  " />*/}
                    {getUnreadMessagesQuantity()}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <button
          onClick={async () => {
            socket.emit('userState', false);
            await signOut({
              redirect: false,
            });
            await router.push('/login');
          }}
          className="solid h-7 w-7 flex flex-col items-center bg-white shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 hover:bg-softGreen justify-center overflow-hidden rounded-full border border-stroke focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80 tablet:h-8 tablet:w-8"
        >
          <LogOutIcon className="h-4 w-4 text-darkSkyBlue-60" />
        </button>
      </div>
    </header>
  );
};
