import { GeneralLayout } from '@/components/layouts/General/Layout';

import {
  useGetMyInfoQuery,
  usePathInfoMutation,
  UserDTO,
} from '@/redux/api/user.api';
import { Button } from '@/components/ui/Button';
import React, { useEffect } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { useSelector } from 'react-redux';
import { Spinner } from '@/components/ui/Spinner';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { ListBox } from '@/components/Listbox';
import DateIcon from '@/public/IconsSet/calendar-date.svg';
import BuildingIcon from '@/public/IconsSet/building-08.svg';
import PuzzleIcon from '@/public/IconsSet/puzzle-piece-02.svg';
import NotificationIcon from '@/public/IconsSet/notification-text.svg';
import ImageIcon from '@/public/IconsSet/image-user.svg';
import GlobeIcon from '@/public/IconsSet/globe-06.svg';
import ModemIcon from '@/public/IconsSet/modem-02.svg';
import { UserSettings } from '@/components/user/UserSettings';
import { UserInfo } from '@/components/user/UserInfo';

const MyPage = () => {
  // const router = useRouter();
  // const session = useSession();
  // if (!session.data) {
  //   return router.push('/login');
  // }
  const { data: infoData, isSuccess, refetch } = useGetMyInfoQuery();

  return (
    <GeneralLayout currentPage={'my'}>
      <div className="flex gap-6 tablet:gap-12">
        <div className="p-4 border border-stroke rounded-md bg-yellow-10 shadow-inner shadow-dark-60">
          <UserInfo userInfo={infoData} isSuccess={isSuccess} />
        </div>

        <UserSettings isSuccess={isSuccess} infoData={infoData} />
      </div>
    </GeneralLayout>
  );
};

export default MyPage;
