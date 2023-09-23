import { FC } from 'react';
import {
  useAddRequestConnectMutation,
  UserDTO,
  useDeleteRequestConnectMutation,
} from '@/redux/api/user.api';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import GlobeIcon from '@/public/IconsSet/globe-06.svg';
import WifiOffIcon from '@/public/IconsSet/wifi-off.svg';
import { LazyQueryTrigger } from '@reduxjs/toolkit/src/query/react/buildHooks';
import { QueryDefinition } from '@reduxjs/toolkit/query';

type UserCardProps = {
  user: UserDTO;
  lazyTrigger: LazyQueryTrigger<QueryDefinition<any, any, any, any>>;
};
export const UserCard: FC<UserCardProps> = ({ user, lazyTrigger }) => {
  const [addRequestConnect] = useAddRequestConnectMutation();
  const [deleteRequestConnect] = useDeleteRequestConnectMutation();
  return (
    <div className="flex flex-col gap-2 border border-stroke rounded-md p-3 shadow-sm shadow-dark-60 bg-softGreen">
      <p className="text-dispS2 text-dark-80 font-semibold">{user.name}</p>
      <div className="flex gap-4 justify-between tablet:flex-row flex-col">
        <div className="flex gap-4 tablet:flex-row flex-col">
          <div className="flex flex-col gap-2">
            {user.avatar && user.name ? (
              <div className="p-2 border w-fit border-stroke rounded-md bg-white shadow-sm shadow-dark-60 self-center">
                <Image
                  className="object-cover rounded-md border border-stroke shadow-sm shadow-dark-60 w-[150px] h-[150px]"
                  src={user.avatar.buffer}
                  alt={user.name}
                  width={50}
                  height={50}
                />
              </div>
            ) : (
              <div className="p-2 border w-fit border-stroke rounded-md bg-white shadow-sm shadow-dark-60 self-center">
                <p className="flex items-center text-dark-100 font-semibold text-parM justify-center rounded-md border bg-yellow-10 border-stroke shadow-inner shadow-dark-60 w-[150px] h-[150px]">
                  No Image
                </p>
              </div>
            )}
          </div>
          <div className="text-dispS2 text-dark-100 font-bold flex flex-col justify-between gap-4">
            <div>
              <p>{user.firstname}</p>
              <p>{user.lastname}</p>
            </div>
            <p>{user.birthday}</p>
            <p className="text-parL text-dark-80 font-normal">
              {user.company && user.role
                ? `${user.role} at ${user.company}`
                : user.role && !user.company
                ? user.role
                : !user.role && user.company
                ? `Working someone at ${user.company}`
                : ''}
            </p>
          </div>
        </div>

        {user.isConnect === 'false' ? (
          <Button
            onClick={async () => {
              await addRequestConnect(user?._id!);
              await lazyTrigger(undefined, false);
            }}
            variant="yellow"
            text={'Try connect'}
            icon={{ svg: <GlobeIcon />, position: 'end' }}
            className="text-dark-80 h-fit self-center "
          />
        ) : null}
        {user.isConnect === 'request' ? (
          <Button
            onClick={async () => {
              await deleteRequestConnect(user?._id!);
              await lazyTrigger(undefined, false);
            }}
            variant="yellowRed"
            text={'Delete request'}
            icon={{ svg: <WifiOffIcon />, position: 'end' }}
            className="text-dark-80 h-fit self-center "
          />
        ) : null}
        {user.isConnect === 'response' ? (
          <>
            <div className="flex flex-col">
              <p className="text-dark-100 text-parL mb-2">
                Confirm adding connection?
              </p>
              <div className="flex">
                <Button
                  onClick={async () => {
                    await addRequestConnect(user?._id!);
                    await lazyTrigger(undefined, false);
                  }}
                  variant="yellow"
                  text={'Confirm'}
                  icon={{ svg: <GlobeIcon />, position: 'end' }}
                  className="text-dark-80 h-fit self-center "
                />
                <Button
                  onClick={async () => {
                    await deleteRequestConnect(user?._id!);
                    await lazyTrigger(undefined, false);
                  }}
                  variant="yellowRed"
                  text={'Ignore'}
                  icon={{ svg: <WifiOffIcon />, position: 'end' }}
                  className="text-dark-80 h-fit self-center ml-2"
                />
              </div>
            </div>
          </>
        ) : null}
        {user.isConnect === 'true' ? (
          <div>
            <p className="text-green-100 text-center text-parL mb-2 py-1 px-4 border border-green-100 rounded-md">
              CONNECTED
            </p>
            <Button
              onClick={async () => {
                await deleteRequestConnect(user?._id!);
                await lazyTrigger(undefined, false);
              }}
              variant="yellowRed"
              text={'Break connection'}
              icon={{ svg: <WifiOffIcon />, position: 'end' }}
              className="text-dark-80 h-fit self-center "
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
