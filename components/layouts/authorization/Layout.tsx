import Link from 'next/link';

import type { LayoutProps } from '@/types';
import type { FC } from 'react';
import clsx from 'clsx';

export const AuthorizationLayout: FC<LayoutProps> = ({ children, page }) => {
  return (
    <>
      <div className="flex h-screen flex-col items-center">
        <header className="border border-b border-stroke bg-softGreen w-full ">
          <div className="mx-auto  flex gap-6 justify-end w-full px-4 py-9 tablet:w-[460px] tablet:px-0 tablet:py-10">
            <Link
              href="/login"
              className={clsx(
                page === 'login' ? 'shadow-sm bg-none' : '',
                'shadow-md bg-white hover:bg-softGreen hover:shadow-sm hover:shadow-dark-60 rounded-md px-4 py-2 shadow-dark-60 focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80 focus:ring-offset-2',
              )}
            >
              Sign-In
            </Link>
            <Link
              href="/register"
              className={clsx(
                page === 'register' ? 'shadow-sm bg-softGreen' : '',
                ' shadow-md hover:bg-softGreen bg-white hover:shadow-sm hover:shadow-dark-60 rounded-md px-4 py-2 shadow-dark-60 focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80 focus:ring-offset-2',
              )}
            >
              Sign-Up
            </Link>
          </div>
        </header>
        <div className="px-4 tablet:px-0 w-full h-full flex flex-col items-center bg-softGreen">
          <div className="w-full rounded-bl-md rounded-br-md mb-4  h-full tablet:w-fit bg-white pt-10 tablet:pt-24 px-4 tablet:px-24 border-r border-l border-b border-stroke">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
