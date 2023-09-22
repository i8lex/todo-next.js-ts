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
    try {
      const data: UserDTO = {};
      console.log('firstname', values.firstname !== infoData?.firstname);
      if (values.firstname !== infoData?.firstname) {
        data.firstname = values.firstname;
      }
      if (values.lastname !== infoData?.lastname) {
        data.lastname = values.lastname;
      }
      if (values.birthday !== infoData?.birthday) {
        data.birthday = values.birthday;
      }
      if (values.isBirthdayShowing !== infoData?.isBirthdayShowing) {
        data.isBirthdayShowing = values.isBirthdayShowing;
      }
      if (values.gender !== infoData?.gender) {
        data.gender = values.gender;
      }
      if (values.isGenderShowing !== infoData?.isGenderShowing) {
        data.isGenderShowing = values.isGenderShowing;
      }
      if (values.company !== infoData?.company) {
        data.company = values.company;
      }
      if (values.isCompanyShowing !== infoData?.isCompanyShowing) {
        data.isCompanyShowing = values.isCompanyShowing;
      }
      if (values.role !== infoData?.role) {
        data.role = values.role;
      }
      if (values.isRoleShowing !== infoData?.isRoleShowing) {
        data.isRoleShowing = values.isRoleShowing;
      }
      if (values.about !== infoData?.about) {
        data.about = values.about;
      }
      if (values.isAboutShowing !== infoData?.isAboutShowing) {
        data.isAboutShowing = values.isAboutShowing;
      }
      if (values.isConnectsShowing !== infoData?.isConnectsShowing) {
        data.isConnectsShowing = values.isConnectsShowing;
      }
      if (values.isEventsShowing !== infoData?.isEventsShowing) {
        data.isEventsShowing = values.isEventsShowing;
      }

      if (avatar.mimetype && avatar.buffer !== values.avatar?.buffer) {
        data.avatar = {
          name: avatar.filename,
          buffer: avatar.file,

          mimeType: avatar.mimetype,
        };
      }
      if (!!Object.keys(data).length) {
        await pathInfo(data);
        await getMyInfoTrigger();
      }
    } catch (error) {
      console.log(error);
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
        <div className="flex flex-col gap-4 tablet:gap-6">
          <ImageUploader maxFiles={1} maxSize={2 * 1024 * 1024} />
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
              render={({ field }) => {
                return (
                  <ListBox
                    label={'Show birthday'}
                    field={field}
                    svg={<DateIcon className={'w-5 h-5 text-dark-80'} />}
                    defaultValue={infoData?.isBirthdayShowing}
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
              render={({ field }) => {
                return (
                  <ListBox
                    label={'Show role'}
                    svg={<PuzzleIcon className={'w-5 h-5 text-dark-80'} />}
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
                render={({ field }) => {
                  return (
                    <ListBox
                      label={'Show about'}
                      svg={
                        <NotificationIcon className={'w-5 h-5 text-dark-80'} />
                      }
                      className={'self-start'}
                      field={field}
                      defaultValue={infoData?.isCompanyShowing}
                      valuesArray={valuesForListBox}
                    />
                  );
                }}
              />
              <div className="flex flex-col gap-4 tablet:gap-6">
                <Controller
                  name={`gender`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Your gender'}
                        field={field}
                        defaultValue={infoData?.gender}
                        valuesArray={valuesForGenderListBox}
                      />
                    );
                  }}
                />

                <Controller
                  name={`isGenderShowing`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Show gender'}
                        svg={<ImageIcon className={'w-5 h-5 text-dark-80'} />}
                        field={field}
                        defaultValue={infoData?.isGenderShowing}
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
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Show events'}
                        svg={<GlobeIcon className={'w-5 h-5 text-dark-80'} />}
                        field={field}
                        defaultValue={infoData?.isEventsShowing}
                        valuesArray={valuesForListBox}
                      />
                    );
                  }}
                />
                <Controller
                  name={`isConnectsShowing`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <ListBox
                        label={'Show connects'}
                        svg={<ModemIcon className={'w-5 h-5 text-dark-80'} />}
                        field={field}
                        defaultValue={infoData?.isConnectsShowing}
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
