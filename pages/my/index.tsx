import { GeneralLayout } from '@/components/layouts/General/Layout';

import {
  useGetMyInfoQuery,
  usePathInfoMutation,
  UserDTO,
} from '@/redux/api/user.api';
import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { useSelector } from 'react-redux';
import { Spinner } from '@/components/ui/Spinner';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { ListBox } from '@/components/Listbox';
import DateIcon from '@/public/IconsSet/calendar-date.svg';
import BuildingIcon from '@/public/IconsSet/building-08.svg';
import PuzzleIcon from '@/public/IconsSet/puzzle-piece-02.svg';
import ChatIcon from '@/public/IconsSet/message-chat-square.svg';
import SettingsIcon from '@/public/IconsSet/users-edit.svg';
import GlobeIcon from '@/public/IconsSet/globe-06.svg';
import ModemIcon from '@/public/IconsSet/modem-02.svg';
import { UserSettings } from '@/components/user/UserSettings';
import { UserInfo } from '@/components/user/UserInfo';
import clsx from 'clsx';

const MyPage = () => {
  // const router = useRouter();
  // const session = useSession();
  // if (!session.data) {
  //   return router.push('/login');
  // }
  const { data: infoData, isSuccess, refetch } = useGetMyInfoQuery();
  const [isVisible, setIsVisible] = useState({
    settings: false,
    connections: true,
    chats: false,
  });
  console.log(isVisible);
  return (
    <GeneralLayout currentPage={'my'}>
      <div className="flex flex-col tablet:flex-row gap-6">
        <div className="p-4 border border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60 flex-1">
          <UserInfo userInfo={infoData} isSuccess={isSuccess} />
        </div>
        <div className="flex laptop:min-w-[572px] tablet:min-w-[400px] flex-col gap-6 justify-between tablet:justify-start bg-softGreen h-full w-full shadow-inner shadow-dark-60 tablet:w-fit border border-stroke rounded-md p-4">
          <div className="flex gap-4 items-center justify-between self-end">
            <p className="tablet:text-dispS1 hidden tablet:block text-dark-100 font-bold">
              {isVisible.settings ? 'Settings and info' : ''}
              {isVisible.connections ? 'My connections' : ''}
              {isVisible.chats ? 'My discussions' : ''}
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
            <UserSettings isSuccess={isSuccess} infoData={infoData} />
          ) : null}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default MyPage;
