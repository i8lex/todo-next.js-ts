import { UserDTO } from '@/redux/api/user.api';
import Image from 'next/image';
import React, { FC } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { getAge } from '@/utils/getAge';

type UserInfoProps = {
  userInfo?: UserDTO;
  isSuccess: boolean;
};

export const UserInfo: FC<UserInfoProps> = ({ userInfo, isSuccess }) => {
  const birthday = getAge(userInfo?.birthday!);
  return isSuccess ? (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col ">
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
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-dispS1 text-dark-100 font-bold">
            {userInfo?.name}
          </p>
          <div className="text-dispS2 text-dark-100">
            <p className="text-dispS2">{userInfo?.firstname}</p>
            <p className="ml-6">{userInfo?.lastname}</p>
          </div>
          <div className="flex justify-between text-parS text-dark-80">
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
      <div className={'max-w-[480px]'}>
        <p className="text-parM text-dark-100 font-semibold mb-2">About me:</p>
        <p className="text-parS text-dark-80">{userInfo?.about}</p>
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner className={'text-green-60 fill-softGreen w-44 h-44'} />
    </div>
  );
};
