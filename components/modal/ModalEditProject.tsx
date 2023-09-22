import React, { FC, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { form } from '@/constants/form';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { usePathEventMutation } from '@/redux/api/events.api';

type FormRequiredFields = {
  title: string;
  description: string;
  deadline: string | Date;
};

type ModalEditProjectProps = {
  id: string;
  title: string;
  isOpen: boolean;
  handleClose: () => void;
  data: Event;
};

export const ModalEditProject: FC<ModalEditProjectProps> = ({
  id,
  title,
  isOpen,
  handleClose,
  data,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormRequiredFields>();
  const [pathEvent] = usePathEventMutation();

  useEffect(() => {
    setValue('title', data.title);
    if (data.description) {
      setValue('description', data.description);
    }
    if (data.deadline) {
      setValue('deadline', new Date(data.deadline));
    }
  }, []);
  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const onSubmit = async (values: FormRequiredFields) => {
    console.log(id);
    await pathEvent({ id: id, body: values });
    reset();
    handleClose();
  };
  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 tablet:bg-[#6B7280BF] tablet:bg-opacity-75"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex max-h-[100vh] items-start justify-center overflow-y-auto  tablet:items-center tablet:p-4">
              <Dialog.Panel className="h-full w-screen overflow-hidden overflow-y-auto bg-white text-parL font-medium text-darkSkyBlue-100 tablet:m-auto tablet:h-auto tablet:w-[642px] tablet:rounded-3xl">
                <div className="flex items-center  justify-between border-y border-y-stroke bg-softGreen px-4 py-3.5 tablet:border-t-0 tablet:px-6 tablet:py-4">
                  <Dialog.Title>
                    <div className="flex items-center gap-1">
                      <div>Edit event {title}</div>
                    </div>
                  </Dialog.Title>
                </div>
                <div className="shadow-inner shadow-dark-60 h-[90vh] tablet:h-fit p-4 tablet:p-6">
                  <form
                    onSubmit={handleSubmit(onSubmit, handleError)}
                    noValidate
                    method="post"
                    className="flex flex-col  items-stretch  tablet:gap-8 gap-0 w-full h-full"
                  >
                    <div className="flex flex-col gap-6 items-center w-full h-full">
                      <Input
                        label={'Enter title'}
                        isRequired={true}
                        type="text"
                        id="title"
                        defaultValue={data.title}
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
                        // defaultValue={data.description}
                        type="text"
                        as={'textarea'}
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
                      <Input
                        label={'Enter deadline'}
                        isRequired={true}
                        // defaultValue={data.deadline}
                        type="datetime-local"
                        id="deadline"
                        control={control}
                        errorText={errors?.deadline?.message}
                        {...register('deadline')}
                      />
                    </div>

                    <div className="flex gap-4 tablet:justify-end justify-between w-full">
                      <Button
                        text={'Cancel'}
                        type="button"
                        variant={'white'}
                        className="w-full tablet:w-[140px]"
                        onClick={handleClose}
                      />
                      <Button text="Confirm" type="submit" />
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
