import { useGetUsersQuery } from '@/redux/api/user.api';
import { GeneralLayout } from '@/components/layouts/General/Layout';
import { UserCard } from '@/components/user/UserCard';

const UsersPage = () => {
  const { data: users, isSuccess } = useGetUsersQuery();
  console.log(users);
  return (
    <>
      <GeneralLayout currentPage={'users'}>
        <div className="flex flex-col gap-6 p-4 border border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60">
          {users?.map((user) => {
            return <UserCard key={user._id} user={user} />;
          })}
        </div>
      </GeneralLayout>
    </>
  );
};

export default UsersPage;
