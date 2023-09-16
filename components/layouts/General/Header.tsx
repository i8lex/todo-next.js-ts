import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import clsx from 'clsx';

import AccountImage from '~/public/AccountImage.svg';
import Logo from '~/public/Favicon.svg';
import CalendarIcon from '~/public/IconsSet/calendar-check-01.svg';
import NotificationIcon from '~/public/IconsSet/notification-box.svg';

import type { Page } from '~/types';
import type { FC } from 'react';

export type GeneralHeaderProps = {
  currentPage: Page;
};

export const GeneralHeader: FC<GeneralHeaderProps> = ({ currentPage }) => {
  const router = useRouter();

  const { data } = useSession();
  //@ts-expect-error
  const isTeacher = data?.user.roleId == 1;

  const links: Array<{ id: Page; href: string; name: string }> = [
    { id: 'calendar', href: '/calendar', name: 'Calendar' },
    {
      id: `${isTeacher ? 'students' : 'groups'}`,
      href: `${isTeacher ? '/students' : '/groups'}`,
      name: `${isTeacher ? 'Students' : 'Classes'}`,
    },
    { id: 'materials', href: '/materials', name: 'Materials' },
    { id: 'settings', href: '/settings', name: 'Settings' },
  ];
  return (
    <header className="flex justify-center bg-white bg-opacity-80 px-4 py-2 tablet:px-6">
      <nav className="flex w-full items-center p-0 tablet:gap-6 desktop:gap-8">
        <Link
          href={'/'}
          className="focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80"
        >
          <Logo className="w-6 tablet:w-7" />
        </Link>
        <div className="hidden space-x-8 text-quot font-medium  tablet:flex desktop:text-parS">
          {links.map(({ id, name, href }) => {
            const isCurrent = id === currentPage;
            return (
              <Link
                key={id}
                className={clsx(
                  'rounded-md py-2 px-3 focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80',
                  isCurrent
                    ? 'bg-mystic-100 text-darkSkyBlue-90'
                    : 'bg-white text-darkSkyBlue-60 hover:bg-darkSkyBlue-20',
                )}
                href={href}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href={'#'}
          className="hidden h-0 w-0 flex-col items-center justify-center rounded-full border-stroke hover:bg-darkSkyBlue-20 focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80 tablet:flex tablet:h-8 tablet:w-8 tablet:border"
        >
          <CalendarIcon className="w-4 text-darkSkyBlue-80" />
        </Link>
        <Link
          href={'#'}
          className="hidden h-8 w-8 flex-col items-center justify-center rounded-full border-stroke hover:bg-darkSkyBlue-20 focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80 tablet:flex tablet:border"
        >
          <NotificationIcon className="w-4 text-darkSkyBlue-80" />
        </Link>
        <button
          onClick={async () => {
            await signOut({
              redirect: false,
            });
            router.push('/login');
          }}
          className="solid h-7 w-7 overflow-hidden rounded-full border border-stroke focus:border-green-80 focus:outline-none focus:ring-2 focus:ring-green-80 tablet:h-8 tablet:w-8"
        >
          <AccountImage />
        </button>
      </div>
    </header>
  );
};
