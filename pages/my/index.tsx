import { GeneralLayout } from '@/components/layouts/General/Layout';

import { useGetUsersQuery, useGetMyInfoQuery } from '@/redux/api/user.api';
import { Button } from '@/components/ui/Button';
import React, { FC, useEffect, useState } from 'react';

import ChatIcon from '@/public/IconsSet/message-chat-square.svg';
import SettingsIcon from '@/public/IconsSet/users-edit.svg';
import GlobeIcon from '@/public/IconsSet/globe-06.svg';
import { UserSettings } from '@/components/user/UserSettings';
import { UserInfo } from '@/components/user/UserInfo';
import clsx from 'clsx';
import { UserCard } from '@/components/user/UserCard';
import { Chat } from '@/components/chats/Chat';
import { getSession, SignInResponse } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSession } from '@/redux/slices/auth.slice';
import { Spinner } from '@/components/ui/Spinner';
import { addChatId } from '@/redux/slices/chat.slice';
import { Chats } from '@/components/chats/Chats';

type MyPageProps = {
  session: SignInResponse & {
    user: {
      token: string;
      name: string;
      _id: string;
      email: string;
      isConfirmed: boolean;
    };
  };
};
type GetServerSideProps = Promise<
  | { redirect: { permanent: boolean; destination: string } }
  | {
      props: { session: Session };
    }
>;

export const getServerSideProps: (
  ctx: GetServerSidePropsContext,
) => GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const currentDate = new Date();

  if (!session || new Date(session.expires) < currentDate) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

const MyPage: FC<MyPageProps> = ({ session }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session && session.user) {
      dispatch(setSession(session.user));
    }
  }, [dispatch, session]);
  const { data: infoData, isSuccess: isInfoSuccess } = useGetMyInfoQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  );
  const { data: users, isSuccess: isUsersSuccess } = useGetUsersQuery(
    'connected',
    { refetchOnMountOrArgChange: true },
  );
  const chatId = useAppSelector((state) => state.chat._id);
  const [isVisible, setIsVisible] = useState({
    settings: false,
    connections: true,
    chats: false,
  });
  return (
    <GeneralLayout currentPage={'my'}>
      <div className="flex flex-col tablet:flex-row gap-6">
        <div className="p-4 border border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60 flex-1">
          <UserInfo userInfo={infoData} isSuccess={isInfoSuccess} />
        </div>
        <div className="flex tablet:h-[89dvh] h-full laptop:min-w-[572px] tablet:min-w-[400px] flex-col gap-6 justify-between tablet:justify-start bg-softGreen w-full shadow-inner shadow-dark-60 tablet:w-fit border border-stroke rounded-md p-4">
          <div className="flex gap-4 items-center  justify-between self-end w-fit tablet:w-full">
            <p className="tablet:text-dispS1 hidden tablet:block text-dark-100 font-bold">
              {isVisible.settings ? 'Settings and info' : ''}
              {isVisible.connections ? 'My connections' : ''}
              {isVisible.chats && !chatId ? 'My discussions' : ''}
              {isVisible.chats && chatId ? 'Chat' : ''}
            </p>
            <div className="flex items-center gap-4 px-4 py-2 border border-stroke rounded-md bg-softGreen shadow-inner shadow-dark-60 w-fit self-end">
              <Button
                className={clsx(
                  isVisible.chats
                    ? 'bg-yellow-20 shadow-sm shadow-dark-60 hover:bg-yellow-40'
                    : '',
                  'text-dark-80',
                )}
                text={''}
                size={'iconbase'}
                onClick={() => {
                  dispatch(addChatId(''));
                  setIsVisible({
                    settings: false,
                    connections: false,
                    chats: true,
                  });
                }}
                icon={{
                  svg: <ChatIcon />,
                }}
                variant={'yellow'}
              />
              <Button
                text={''}
                onClick={() => {
                  setIsVisible({
                    settings: false,
                    connections: true,
                    chats: false,
                  });
                }}
                className={clsx(
                  isVisible.connections
                    ? 'bg-yellow-20 shadow-sm shadow-dark-60 hover:bg-yellow-40'
                    : '',
                  'text-dark-80',
                )}
                size={'iconbase'}
                icon={{
                  svg: <GlobeIcon />,
                }}
                variant={'yellow'}
              />
              <Button
                text={''}
                onClick={() => {
                  setIsVisible({
                    settings: true,
                    connections: false,
                    chats: false,
                  });
                }}
                className={clsx(
                  isVisible.settings
                    ? 'bg-yellow-20 shadow-sm shadow-dark-60 hover:bg-yellow-40'
                    : '',
                  'text-dark-80',
                )}
                size={'iconbase'}
                icon={{
                  svg: <SettingsIcon />,
                }}
                variant={'yellow'}
              />
            </div>
          </div>

          {isVisible.settings ? (
            <>
              <UserSettings isSuccess={isInfoSuccess} infoData={infoData} />
            </>
          ) : null}

          {isVisible.connections ? (
            isUsersSuccess ? (
              <div className="overflow-y-auto flex flex-col gap-4 tablet:overflow-y-scroll">
                {users?.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    setIsVisible={setIsVisible}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Spinner className={'w-40 h-40 fill-green-20 text-green-60'} />
              </div>
            )
          ) : null}
          {isVisible.chats && chatId ? (
            <Chat />
          ) : isVisible.chats ? (
            <Chats />
          ) : null}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default MyPage;
