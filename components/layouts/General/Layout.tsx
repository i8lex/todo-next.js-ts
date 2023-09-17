import clsx from 'clsx';

import { GeneralHeader } from './Header';

import type { Page } from '@/types';
import type { FC, ReactNode } from 'react';

export type GeneralLayoutProps = {
  children: ReactNode;
  currentPage: Page;
  className?: string;
};

export const GeneralLayout: FC<GeneralLayoutProps> = ({
  children,
  currentPage,
  className,
}) => {
  return (
    <>
      <div className="sticky top-0 z-50 w-full p-0">
        <div className="z-50 mx-auto w-full bg-white p-0 desktop:w-[1200px]">
          <GeneralHeader currentPage={currentPage} />
        </div>
        <div className="border-b border-stroke" />
      </div>

      <div className={clsx(className, '')}>{children}</div>
    </>
  );
};
