import { ChatDTO } from '@/redux/api/chats.api';
import { FC } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { addChatId } from '@/redux/slices/chat.slice';

type ChatCardProps = {
  chat: ChatDTO;
};
export const ChatCard: FC<ChatCardProps> = ({ chat }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={
        'cursor-pointer p-4 flex justify-between border border-stroke rounded-md w-full bg-blue-10 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60'
      }
      onClick={() => {
        if (chat._id) {
          dispatch(addChatId(chat._id));
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-dispS3 text-dark-100 font-bold">{chat.title}</p>
        <div className="flex gap-2">
          {chat.userNames
            ? chat.userNames.map((name) => (
                <p key={name} className="text-parM text-dark-100 truncate">
                  {name}
                </p>
              ))
            : null}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p>Unread messages</p>
        {chat.messages.length ? <p>{chat.messages.length}</p> : null}
      </div>
    </div>
  );
};
