import React, { useState } from 'react';
import ArrowUpIcon from '@/public/IconsSet/chevron-up.svg';
import ArrowDownIcon from '@/public/IconsSet/chevron-down.svg';

import { useGetEventsQuery, useAddEventMutation } from '@/redux/api/events.api';
import { form } from '@/constants/form';
import { ModalEditProject } from '@/components/modal/ModalEditProject';
import { EventsList } from '@/components/events/EventsList';
import { GeneralLayout } from '@/components/layouts/General/Layout';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';
import { Spinner } from '@/components/ui/Spinner';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Session } from 'next-auth';
import { GetServerSidePropsContext } from 'next';

type FormRequiredFields = {
  title: string;
  description: string;
};

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
const EventsPage = () => {
  const { data: events = [], isLoading } = useGetEventsQuery();
  const [addEvent] = useAddEventMutation();
  const [isCreateShowing, setCreateShowing] = useState(false);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormRequiredFields>();

  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const onSubmit = async (values: FormRequiredFields) => {
    await addEvent(values).unwrap();
    reset();
    setCreateShowing(false);
  };
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col justify-center items-center">
        <Spinner className="fill-green-20 text-green-60 w-20 h-20 tablet:w-40 tablet:h-40" />
      </div>
    );
  }

  return (
    <GeneralLayout currentPage={'events'}>
      <div className="flex flex-col gap-8 h-[88vh] laptop:flex-row tablet:gap-6 justify-start tablet:justify-between">
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          noValidate
          method="post"
          className="flex flex-col gap-4 tablet:gap-6 w-full laptop:w-fit"
        >
          <div className="flex items-center w-full laptop:w-[390px]  justify-between text-dispS2 text-dark-100 tablet:text-dispL font-bold">
            <p className="text-parL tablet:text-dispS1 text-dark-100">
              Create project
            </p>

            <div
              onClick={() => {
                setCreateShowing(!isCreateShowing);
              }}
              className={clsx(
                isCreateShowing
                  ? 'bg-yellow-20 shadow-sm  hover:bg-yellow-40'
                  : 'bg-yellow-10 shadow-md hover:shadow-sm hover:bg-yellow-20',
                'flex flex-col cursor-pointer items-center shadow-dark-60 hover:shadow-dark-60 rounded-md justify-center w-[30px] h-[30px] p-1',
              )}
            >
              {isCreateShowing ? (
                <ArrowUpIcon className="w-[20px] h-[20px]" />
              ) : (
                <ArrowDownIcon className="w-[20px] h-[20px]" />
              )}
            </div>
          </div>
          <div
            className={clsx(
              isCreateShowing ? 'flex' : 'hidden',
              ' flex-col gap-4 tablet:gap-6',
            )}
          >
            <Input
              label={'Enter title'}
              isRequired={true}
              type="text"
              // placeholder={'Enter your email'}
              id="title"
              control={control}
              errorText={errors?.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Title must be at most 20 characters',
                },
              })}
            />
            <Input
              label={'Enter description'}
              isRequired={true}
              type="text"
              as={'textarea'}
              // placeholder={'Enter your email'}
              id="description"
              control={control}
              errorText={errors?.description?.message}
              {...register('description', {
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
                maxLength: {
                  value: 2000,
                  message: 'Title must be at most 2000 characters',
                },
              })}
            />

            <Button
              className="w-full laptop:w-[390px] tablet:w-[290px]"
              text={'Create'}
              type="submit"
            />
          </div>
        </form>

        <div className="flex flex-col w-full bg-softGreen shadow-inner shadow-dark-60 overflow-y-scroll gap-4 h-full max-h-screen mb-4 tablet:mb-6 tablet:gap-6 p-4 tablet:p-6 border border-stroke rounded-md">
          {events.map((event) => {
            return (
              <div key={event._id}>
                <EventsList event={event} setEditModalOpen={setEditModalOpen} />
                {event._id ? (
                  <ModalEditProject
                    id={event._id}
                    isOpen={isEditModalOpen}
                    title={event.title}
                    data={event}
                    handleClose={() => {
                      setEditModalOpen(false);
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default EventsPage;
