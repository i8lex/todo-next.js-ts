import {
  useLazyGetMyInfoQuery,
  usePathInfoMutation,
  UserDTO,
} from '@/redux/api/user.api';
import { Button } from '@/components/ui/Button';
import React, { FC, useEffect } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { useSelector } from 'react-redux';
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
import { Spinner } from '@/components/ui/Spinner';
import { onSubmitUpdateUserFormUtil } from '@/utils/onSubmitUpdateUserFormUtil';

type FormRequiredFields = {
  firstname?: string;
  lastname?: string;
  birthday?: string;
  isBirthdayShowing?: string;
  gender?: string;
  isGenderShowing?: string;
  company?: string;
  isCompanyShowing?: string;
  role?: string;
  isRoleShowing?: string;
  about?: string;
  isAboutShowing?: string;
  isEventsShowing?: string;
  isConnectsShowing?: string;
  image?: File;
  avatar?: {
    name: string;
    buffer: string;
    mimeType: string;
  };
};

type UserSettingsProps = {
  infoData?: UserDTO;
  isSuccess: boolean;
};
export const UserSettings: FC<UserSettingsProps> = ({
  infoData,
  isSuccess,
}) => {
  const [pathInfo] = usePathInfoMutation();
  const [getMyInfoTrigger] = useLazyGetMyInfoQuery();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormRequiredFields>();

  useEffect(() => {
    if (infoData?.firstname) {
      setValue('firstname', infoData.firstname);
    }
    if (infoData?.lastname) {
      setValue('lastname', infoData.lastname);
    }
    if (infoData?.birthday) {
      setValue('birthday', infoData.birthday);
    }
    if (infoData?.isBirthdayShowing) {
      setValue('isBirthdayShowing', infoData.isBirthdayShowing);
    }
    if (infoData?.gender) {
      setValue('gender', infoData.gender);
    }
    if (infoData?.isGenderShowing) {
      setValue('isGenderShowing', infoData.isGenderShowing);
    }
    if (infoData?.company) {
      setValue('company', infoData.company);
    }
    if (infoData?.isCompanyShowing) {
      setValue('isCompanyShowing', infoData.isCompanyShowing);
    }
    if (infoData?.role) {
      setValue('role', infoData.role);
    }
    if (infoData?.isRoleShowing) {
      setValue('isRoleShowing', infoData.isRoleShowing);
    }
    if (infoData?.about) {
      setValue('about', infoData.about);
    }
    if (infoData?.isAboutShowing) {
      setValue('isAboutShowing', infoData.isAboutShowing);
    }
    if (infoData?.isEventsShowing) {
      setValue('isEventsShowing', infoData.isEventsShowing);
    }
    if (infoData?.isConnectsShowing) {
      setValue('isConnectsShowing', infoData.isConnectsShowing);
    }
    if (infoData?.avatar) {
      setValue('avatar', infoData.avatar);
    }
  }, [infoData]);
  const handleError = (errors: object) => {
    console.warn(errors);
  };

  //@ts-ignore
  const avatar = useSelector((state) => state.image.image);

  const onSubmit = async (values: UserDTO) => {
    if (infoData) {
      const data = onSubmitUpdateUserFormUtil(values, infoData, avatar);

      if (data.isNoEmpty) {
        // @ts-ignore
        await pathInfo(data.formData!);
        await getMyInfoTrigger();
      }
    }
  };
  const valuesForListBox = [
    { value: 'true', label: 'Show' },
    { value: 'false', label: 'Hide' },
    { value: 'connect', label: 'Connected' },
  ];
  const valuesForGenderListBox = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'None', label: 'None' },
  ];
  return isSuccess ? (
    <form
      onSubmit={handleSubmit(onSubmit, handleError)}
      noValidate
      method="post"
      className="flex flex-col gap-6 justify-between tablet:justify-start "
    >
      <div>
        <div className="flex flex-col gap-8 ">
          <ImageUploader
            imageFromDB={infoData?.avatar?.buffer}
            maxFiles={1}
            maxSize={5 * 1024 * 1024}
          />
          <div className="flex items-center gap-6">
            <Input
              label={'Enter firstname'}
              className="laptop:max-w-[240px]"
              isRequired={true}
              type="text"
              id="title"
              control={control}
              errorText={errors?.firstname?.message}
              {...register('firstname', {
                minLength: {
                  value: 3,
                  message: 'Firstname must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Firstname must be at most 20 characters',
                },
              })}
            />
            <Input
              label={'Enter lastname'}
              className="laptop:max-w-[240px]"
              isRequired={true}
              type="text"
              id="title"
              control={control}
              errorText={errors?.lastname?.message}
              {...register('lastname', {
                minLength: {
                  value: 3,
                  message: 'Lastname must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Title must be at most 20 characters',
                },
              })}
            />
          </div>
          <div className="flex items-center gap-6">
            <Input
              label={'Enter your birthday'}
              className={'desktop:w-full tablet:w-fit'}
              isRequired={true}
              type="text"
              id="title"
              control={control}
              errorText={errors?.birthday?.message}
              {...register('birthday', {
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: 'Invalid date format (dd.mm.yyyy)',
                },
              })}
            />
            <Controller
              name={`isBirthdayShowing`}
              control={control}
              defaultValue={infoData?.isBirthdayShowing || 'false'}
              render={({ field }) => {
                return (
                  <ListBox
                    label={'Show birthday'}
                    field={field}
                    svg={<DateIcon className={'w-5 h-5 text-dark-80'} />}
                    defaultValue={infoData?.isBirthdayShowing || 'false'}
                    valuesArray={valuesForListBox}
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center gap-6">
            <Input
              label={'Enter your company'}
              className={'desktop:w-full tablet:w-fit'}
              isRequired={true}
              type="text"
              id="title"
              control={control}
              errorText={errors?.company?.message}
              {...register('company', {
                minLength: {
                  value: 3,
                  message: 'Company name must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Company name must be at most 20 characters',
                },
              })}
            />
            <Controller
              name={`isCompanyShowing`}
              control={control}
              defaultValue={infoData?.isCompanyShowing}
              render={({ field }) => {
                return (
                  <ListBox
                    label={'Show company'}
                    svg={<BuildingIcon className={'w-5 h-5 text-dark-80'} />}
                    field={field}
                    defaultValue={infoData?.isCompanyShowing}
                    valuesArray={valuesForListBox}
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center gap-6">
            <Input
              label={'Your role'}
              className={'desktop:w-full tablet:w-fit'}
              isRequired={true}
              type="text"
              id="role"
              control={control}
              errorText={errors?.role?.message}
              {...register('role', {
                minLength: {
                  value: 3,
                  message: 'Role must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Role must be at most 20 characters',
                },
              })}
            />
            <Controller
              name={`isRoleShowing`}
              control={control}
              defaultValue={infoData?.isCompanyShowing || 'false'}
              render={({ field }) => {
                return (
                  <ListBox
                    label={'Show role'}
                    svg={<PuzzleIcon className={'w-5 h-5 text-dark-80'} />}
                    field={field}
                    defaultValue={infoData?.isCompanyShowing || 'false'}
                    valuesArray={valuesForListBox}
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center gap-6">
            <Input
              label={'Few words about my self'}
              className={
                'desktop:w-full tablet:w-fit h-[282px] tablet:h-[390px]'
              }
              isRequired={true}
              type="text"
              as={'textarea'}
              id="about"
              control={control}
              errorText={errors?.about?.message}
              {...register('about', {
                minLength: {
                  value: 3,
                  message: 'Text must be at least 3 characters',
                },
                maxLength: {
                  value: 2000,
                  message: 'Text must be at most 2000 characters',
                },
              })}
            />
            <div className="flex flex-col gap-6 tablet:gap-8 self-start justify-between items-stretch h-full tablet:h-[390px]">
              <Controller
                name={`isAboutShowing`}
                control={control}
                defaultValue={infoData?.isCompanyShowing || 'false'}
                render={({ field }) => {
                  return (
                    <ListBox
                      label={'Show about'}
                      svg={
                        <NotificationIcon className={'w-5 h-5 text-dark-80'} />
                      }
                      className={'self-start'}
                      field={field}
                      defaultValue={infoData?.isCompanyShowing || 'false'}
                      valuesArray={valuesForListBox}
                    />
                  );
                }}
              />
              <div className="flex flex-col gap-4 tablet:gap-6">
                <Controller
                  name={`gender`}
                  control={control}
                  defaultValue={infoData?.gender || 'None'}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Your gender'}
                        field={field}
                        defaultValue={infoData?.gender || 'None'}
                        valuesArray={valuesForGenderListBox}
                      />
                    );
                  }}
                />

                <Controller
                  name={`isGenderShowing`}
                  control={control}
                  defaultValue={infoData?.isGenderShowing || 'false'}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Show gender'}
                        svg={<ImageIcon className={'w-5 h-5 text-dark-80'} />}
                        field={field}
                        defaultValue={infoData?.isGenderShowing || 'false'}
                        valuesArray={valuesForListBox}
                      />
                    );
                  }}
                />
              </div>
              <div className="flex flex-col gap-4 tablet:gap-6">
                <Controller
                  name={`isEventsShowing`}
                  control={control}
                  defaultValue={infoData?.isEventsShowing || 'false'}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Show events'}
                        svg={<GlobeIcon className={'w-5 h-5 text-dark-80'} />}
                        field={field}
                        defaultValue={infoData?.isEventsShowing || 'false'}
                        valuesArray={valuesForListBox}
                      />
                    );
                  }}
                />
                <Controller
                  name={`isConnectsShowing`}
                  control={control}
                  defaultValue={infoData?.isConnectsShowing || 'false'}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Show connects'}
                        svg={<ModemIcon className={'w-5 h-5 text-dark-80'} />}
                        field={field}
                        defaultValue={infoData?.isConnectsShowing || 'false'}
                        valuesArray={valuesForListBox}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        text={'Done'}
        variant={'primary'}
        size={'base'}
        type={'submit'}
        className="w-full tablet:w-[180px] mb-6"
      />
    </form>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner className={'text-green-60 fill-softGreen w-44 h-44'} />
    </div>
  );
};
