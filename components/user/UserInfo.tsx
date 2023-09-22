import { UserDTO } from '@/redux/api/user.api';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { getAge } from '@/utils/getAge';
import NotificationIcon from '@/public/IconsSet/notification-text.svg';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

type UserInfoProps = {
  userInfo?: UserDTO;
  isSuccess: boolean;
};

export const UserInfo: FC<UserInfoProps> = ({ userInfo, isSuccess }) => {
  const [birthday, setBirthday] = useState('');
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  useEffect(() => {
    if (userInfo?.birthday) {
      setBirthday(getAge(userInfo?.birthday!));
    }
  }, [userInfo?.birthday]);
  console.log(userInfo);
  return isSuccess ? (
    <div className="flex flex-col gap-4">
      <div className="flex laptop:hidden flex-col w-fit">
        <p className="text-dispS3 text-dark-100 font-bold ml-3">
          {userInfo?.name}
        </p>
        {userInfo?.avatar ? (
          <div className="p-2 border border-stroke rounded-md bg-white shadow-sm shadow-dark-60">
            <Image
              width={400}
              height={400}
              priority={true}
              src={userInfo?.avatar?.buffer}
              alt={userInfo?.avatar?.name!}
              className="w-[150px] h-[150px] aspect-square object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="p-2 border border-stroke rounded-md bg-white shadow-sm shadow-dark-60">
            <p className="flex items-center text-dark-100 font-semibold text-parM justify-center rounded-md border bg-yellow-10 border-stroke shadow-inner shadow-dark-60 w-[150px] h-[150px]">
              No Image
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <div className="hidden laptop:flex flex-col ">
          {userInfo?.avatar?.buffer ? (
            <div className="p-2 border border-stroke rounded-md bg-white shadow-sm shadow-dark-60">
              <Image
                width={400}
                height={400}
                priority={true}
                src={userInfo?.avatar?.buffer}
                alt={userInfo?.avatar?.name!}
                className="w-[150px] h-[150px] aspect-square object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="p-2 border border-stroke rounded-md bg-white shadow-sm shadow-dark-60">
              <p className="flex items-center text-dark-100 font-semibold text-parM justify-center rounded-md border bg-yellow-10 border-stroke shadow-inner shadow-dark-60 w-[150px] h-[150px]">
                No Image
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="text-dispS1 hidden laptop:block text-dark-100 font-bold">
            {userInfo?.name}
          </p>
          <div className="text-dispS2 text-dark-100 flex flex-col">
            <p className="text-dispS2">{userInfo?.firstname}</p>
            <p className="ml-6 self-start">{userInfo?.lastname}</p>
          </div>
          <div className="flex justify-between w-full text-parS text-dark-80">
            <p>
              Gender:{' '}
              <span className="text-dark-100 font-semibold">
                {userInfo?.gender}
              </span>{' '}
            </p>
            <p className="text-dark-80">
              Birthday:{' '}
              <span className="text-dark-100 font-semibold">{birthday}</span>{' '}
              y.o.
            </p>
          </div>

          <p className="text-parL text-dark-80 font-bold self-end">
            {userInfo?.role} at {userInfo?.company}
          </p>
        </div>
      </div>
      <div className={'max-w-[682px]'}>
        <div className="flex justify-between items-center mb-2">
          <p className="text-parM text-dark-100 font-semibold ">About me:</p>
          <Button
            onClick={() => {
              setIsAboutVisible(!isAboutVisible);
            }}
            className={clsx(
              isAboutVisible
                ? 'bg-yellow-20 shadow-sm shadow-dark-60 hover:bg-yellow-40'
                : '',
              'text-dark-80 flex tablet:hidden',
            )}
            text={''}
            variant={'yellow'}
            size={'iconbase'}
            icon={{ svg: <NotificationIcon /> }}
          />
        </div>
        <p className="text-parS text-dark-80 hidden tablet:block">
          {userInfo?.about}
        </p>
        {isAboutVisible ? (
          <p className="block tablet:hidden text-parS text-dark-80">
            {userInfo?.about}
          </p>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner className={'text-green-60 fill-softGreen w-44 h-44'} />
    </div>
  );
};
