import React, { FC } from 'react';
import {
  useAddRequestConnectMutation,
  UserDTO,
  useDeleteRequestConnectMutation,
  useLazyGetUsersQuery,
} from '@/redux/api/user.api';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import GlobeIcon from '@/public/IconsSet/globe-06.svg';
import WifiOffIcon from '@/public/IconsSet/wifi-off.svg';
import MessagePlusIcon from '@/public/IconsSet/message-plus-square.svg';
import { addChatId } from '@/redux/slices/chat.slice';
import { useAppDispatch } from '@/redux/hooks';
import { useCreateChatMutation } from '@/redux/api/chats.api';
import { DeleteConfirmModal } from '@/components/modal/DeleteConfirmModal';
import clsx from 'clsx';

type UserCardProps = {
  user: UserDTO;
  setIsVisible?: ({
    settings,
    connections,
    chats,
  }: {
    settings: boolean;
    connections: boolean;
    chats: boolean;
  }) => void;
};
export const UserCard: FC<UserCardProps> = ({ user, setIsVisible }) => {
  const [addRequestConnect] = useAddRequestConnectMutation();
  const [deleteRequestConnect] = useDeleteRequestConnectMutation();
  const [createChat] = useCreateChatMutation();
  const [getUsersTrigger] = useLazyGetUsersQuery();
  const [isDeleteModalShow, setIsDeleteModalShow] = React.useState(false);
  const dispatch = useAppDispatch();

  const addRequestHandler = async () => {
    if (user._id) {
      await addRequestConnect(user?._id);
      await getUsersTrigger('', false);
    }
  };

  const deleteRequestHandler = async () => {
    if (user._id) {
      await deleteRequestConnect(user?._id!);
      await getUsersTrigger('', false);
    }
  };

  return (
    <>
      <DeleteConfirmModal
        showDeleteConfirmModal={isDeleteModalShow}
        setShowDeleteConfirmModal={setIsDeleteModalShow}
        Action={deleteRequestHandler}
        titleText={
          user.isConnect === 'request' ? 'Delete request?' : ' Untouch user?'
        }
        messageText={
          user.isConnect === 'request'
            ? 'Are you sure about delete this request?'
            : 'Are you sure you want to untouch this user?'
        }
        buttonText={user.isConnect === 'request' ? 'Delete' : 'Untouch'}
      />
      <div className="flex flex-col gap-4 tablet:gap-2 border border-stroke rounded-md p-3 shadow-sm shadow-dark-60 bg-softGreen">
        <div className="flex tablet:flex-row flex-col gap-2 justify-between items-center">
          <div className="flex gap-2 ">
            <p className="text-dispS2 self-start tablet:self-center text-dark-80 font-semibold">
              {user.name}
            </p>
            <div
              className={clsx(
                user.isOnline ? 'bg-green-100' : 'bg-error-100',
                'w-3 h-3 rounded-full',
              )}
            />
          </div>
          {user.isConnect === 'true' ? (
            <div className="flex gap-4 items-center w-full tablet:w-fit">
              <p className="text-green-100 text-center text-parS py-1 px-4 border border-green-100 rounded-md">
                CONNECTED
              </p>
              <Button
                onClick={() => {
                  setIsDeleteModalShow(true);
                }}
                variant="yellowRed"
                size={'xs'}
                icon={{
                  svg: (
                    <>
                      <span className="hidden group-hover:block text-parS">
                        Disconnect
                      </span>
                      <WifiOffIcon />
                    </>
                  ),
                  position: 'end',
                }}
                className="text-dark-80 h-fit w-full tablet:self-center group gap-0 self-end"
              />
            </div>
          ) : null}
        </div>
        <div className="flex gap-4 justify-between tablet:flex-row items-center flex-col tablet:items-end">
          <div className="flex gap-4 tablet:flex-row flex-col w-full">
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
            <div className=" text-dark-100 font-bold flex flex-col justify-between gap-4">
              <div className={'text-dispS2'}>
                <p>{user.firstname}</p>
                <p>{user.lastname}</p>
              </div>
              <p>{user.birthday}y.o.</p>
              <p className="text-parM text-dark-80 font-normal">
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
              onClick={addRequestHandler}
              variant="yellow"
              text={'Try connect'}
              icon={{ svg: <GlobeIcon />, position: 'end' }}
              className="text-dark-80 h-fit self-center "
            />
          ) : null}
          {user.isConnect === 'request' ? (
            <Button
              onClick={() => {
                setIsDeleteModalShow(true);
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
                    onClick={addRequestHandler}
                    variant="yellow"
                    text={'Confirm'}
                    icon={{ svg: <GlobeIcon />, position: 'end' }}
                    className="text-dark-80 h-fit self-center "
                  />
                  <Button
                    onClick={async () => {
                      await deleteRequestConnect(user?._id!);
                      await getUsersTrigger('', false);
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
            <div className="h-full flex flex-col items-end justify-end">
              <Button
                onClick={async () => {
                  setIsVisible &&
                    setIsVisible({
                      settings: false,
                      connections: false,
                      chats: true,
                    });
                  const response = await createChat({
                    users: [user?._id!],
                    messages: [],
                  });
                  if ('data' in response) {
                    const { _id } = response.data;
                    if (_id) {
                      dispatch(addChatId(_id));
                    }

                    setIsVisible &&
                      setIsVisible({
                        settings: false,
                        connections: false,
                        chats: true,
                      });
                  }
                }}
                variant="yellow"
                icon={{ svg: <MessagePlusIcon />, position: 'end' }}
                className="text-dark-80 h-fit self-end"
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
