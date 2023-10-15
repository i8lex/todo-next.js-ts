import { ChatDTO } from '@/redux/api/chats.api';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addChatId } from '@/redux/slices/chat.slice';

type ChatCardProps = {
  chat: ChatDTO;
};
export const ChatCard: FC<ChatCardProps> = ({ chat }) => {
  const dispatch = useAppDispatch();
  const ownerName = useAppSelector((state) => state.auth.session.name);
  return (
    <div
      className={
        'cursor-pointer p-4 bg-yellow-10 flex justify-between border border-stroke rounded-md w-full shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60'
      }
      onClick={() => {
        if (chat._id) {
          dispatch(addChatId(chat._id));
        }
      }}
    >
      <div className="flex flex-col">
        <p className="text-dispS3 text-dark-100 font-bold">{chat.title}</p>
        <p className="text-parS text-dark-60 ">Chat with:</p>
        <div className="flex gap-2">
          {chat.userNames
            ? chat.userNames.map((name) =>
                name !== ownerName ? (
                  <p
                    key={name}
                    className="text-parL text-dark-100 truncate font-bold"
                  >
                    {name}
                  </p>
                ) : null,
              )
            : null}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 bg-yellow-20 p-2 shadow-inner shadow-dark-60 border border-stroke rounded-md">
        <p className="text-parS font-digital text-gray-90">Unread messages</p>
        <div className="relative bg-white w-10 h-10 border border-stroke shadow-inner shadow-dark-60 rounded-[3px] font-digital text-parM tablet:text-parL">
          <p className="absolute flex items-center text-dark-20 justify-center top-0 truncate left-0 w-10 h-10 font-digital text-parM tablet:text-parL">
            88
          </p>
          {chat.messages.length ? (
            <p className="absolute flex items-center text-dark-100 justify-center top-0 truncate left-0 w-10 h-10 font-digital text-parM tablet:text-parL">
              {chat.messages.length.toString().padStart(2, '0')}
            </p>
          ) : null}
          <div className="absolute top-0 left-0 w-10 h-10 bg-[#1C8D0444] border border-dark-60 rounded-[3px] shadow-inner shadow-dark-60" />
        </div>
      </div>
    </div>
  );
};
