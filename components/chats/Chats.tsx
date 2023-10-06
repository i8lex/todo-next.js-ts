import { useGetAllChatsQuery } from '@/redux/api/chats.api';
import { Spinner } from '@/components/ui/Spinner';
import { ChatCard } from '@/components/chats/ChatCard';

export const Chats = () => {
  const { data: chats, isSuccess } = useGetAllChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  return (
    <div>
      {isSuccess && chats ? (
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
