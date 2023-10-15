import { useLazyGetAllChatsQuery } from '@/redux/api/chats.api';
import { Spinner } from '@/components/ui/Spinner';
import { ChatCard } from '@/components/chats/ChatCard';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';

export const Chats = () => {
  const [getAllChatsTrigger] = useLazyGetAllChatsQuery();
  const chats = useAppSelector((state) => state.chat.chats);

  useEffect(() => {
    getAllChatsTrigger(undefined, false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {chats ? (
        chats.map((chat) => <ChatCard key={chat._id} chat={chat} />)
      ) : (
        <div className={'flex items-center justify-center w-full h-full'}>
          <Spinner
            className={
              'w-20 h-20 tablet:w-40 tablet:h-40 fill-green-20 text-green-60'
            }
          />
        </div>
      )}
    </div>
  );
};
