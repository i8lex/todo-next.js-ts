import { useGetUsersQuery } from '@/redux/api/user.api';
import { GeneralLayout } from '@/components/layouts/General/Layout';
import { UserCard } from '@/components/user/UserCard';
import { Session } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';

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
  if (!session) {
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
const UsersPage = () => {
  const { data: users, isSuccess } = useGetUsersQuery('', {
    refetchOnMountOrArgChange: true,
  });
  return (
    <>
      <GeneralLayout currentPage={'users'}>
        {isSuccess ? (
          <div className="flex h-[89dvh] overflow-y-scroll flex-col gap-6 p-4 border border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60">
            {users?.map((user) => {
              return <UserCard key={user._id} user={user} />;
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80dvh]">
            <Spinner
              className={
                'tablet:w-40 tablet:h-40 h-20 w-20 fill-green-20 text-green-60'
              }
            />
          </div>
        )}
      </GeneralLayout>
    </>
  );
};

export default UsersPage;
