import { Inter } from 'next/font/google';
import { GetServerSidePropsContext } from 'next';

const inter = Inter({ subsets: ['latin'] });

type GetServerSideProps = Promise<{
  redirect: { permanent: boolean; destination: string };
}>;

export const getServerSideProps: (
  ctx: GetServerSidePropsContext,
) => GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      Hello World!)
    </main>
  );
}
