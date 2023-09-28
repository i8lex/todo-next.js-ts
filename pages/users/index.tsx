import { useGetUsersQuery, useLazyGetUsersQuery } from '@/redux/api/user.api';
import { GeneralLayout } from '@/components/layouts/General/Layout';
import { UserCard } from '@/components/user/UserCard';
import { Session } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

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
  const { data: users } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [getUsersTrigger] = useLazyGetUsersQuery();

  return (
    <>
      <GeneralLayout currentPage={'users'}>
        <div className="flex h-[89dvh] overflow-y-scroll flex-col gap-6 p-4 border border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60">
          {users?.map((user) => {
            return (
              <UserCard
                lazyTrigger={getUsersTrigger}
                key={user._id}
                user={user}
              />
            );
          })}
        </div>
      </GeneralLayout>
    </>
  );
};

export default UsersPage;
