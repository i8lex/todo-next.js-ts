import React, { useState, useEffect, FC } from 'react';
import { useEmailConfirmQuery } from '@/redux/api/auth.api';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { AuthorizationLayout } from '@/components/layouts/authorization/Layout';

type ConfirmEmailPageProps = {
  token: string;
};
export const getServerSideProps: GetServerSideProps<
  ConfirmEmailPageProps
> = async (ctx) => {
  const { confirm } = ctx.query;
  console.log('token', confirm);

  return {
    props: {
      token: confirm ? confirm.toString() : '',
    },
  };
};
const ConfirmEmailPage: FC<ConfirmEmailPageProps> = ({ token }) => {
  const { data, isLoading, isError, error } = useEmailConfirmQuery(token, {
    skip: !token,
  });
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isError) {
      setMessage('Something go wrong');
    } else if (!isLoading && data) {
      setEmail(data.email);
      setMessage(data.message);
      setTimeout(() => router.push('/login'), 5000);
    }
  }, [data, isLoading, isError, error]);

  return (
    <AuthorizationLayout page={''}>
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-1 text-parL text-errorText p-4 border border-stroke rounded-md shadow-sm shadow-dark-60">
          <p>{message}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 text-parL text-dark-100 p-4 border border-stroke rounded-md shadow-sm shadow-dark-60">
          <p>Email</p>
          <p className="font-bold">{email}</p>
          <p>confirmed successful</p>
        </div>
      )}
    </AuthorizationLayout>
  );
};

export default ConfirmEmailPage;
