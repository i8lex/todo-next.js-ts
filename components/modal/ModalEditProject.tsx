import React, { FC, Fragment } from 'react';
import Modal from 'react-modal';
import { Dialog, Transition } from '@headlessui/react';
import { Formik, Form } from 'formik';
import { form } from '@/constants/form';
import { Input } from '../Input';
import { AddEvent, Event } from '@/types';
import { Button } from '@/components/ui/Button';

Modal.setAppElement('#__next');

type ModalEditProjectProps = {
  title: string;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm:
    | ((values: AddEvent) => void)
    | ((values: AddEvent) => Promise<void>);
  data: Event;
};

export const ModalEditProject: FC<ModalEditProjectProps> = ({
  title,
  isOpen,
  handleClose,
  handleConfirm,
  data,
}) => {
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
                  <Formik
                    validationSchema={form.projectsValidationSchema}
                    initialValues={{
                      title: data.title,
                      description: data.description,
                      deadline: data.deadline,
                    }}
                    onSubmit={handleConfirm}
                  >
                    <Form className="flex flex-col  items-stretch  tablet:gap-8 gap-0 w-full h-full">
                      <div className="flex flex-col gap-6 items-center w-full h-full">
                        <Input label="Title" required name="title" />
                        <Input
                          label="Description"
                          as="textarea"
                          name="description"
                        />
                        <Input
                          label="Deadline"
                          type="datetime-local"
                          name="deadline"
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
                    </Form>
                  </Formik>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
