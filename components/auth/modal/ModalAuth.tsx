import React, { FC, Fragment } from 'react';
import { useEmailRepeatMutation } from '@/redux/api/auth.api';
import { Dialog, Transition } from '@headlessui/react';
import CloseIcon from '../../../public/IconsSet/power-01.svg';
import { Button } from '@/components/ui/Button';

type ModalAuthProps = {
  className?: string;
  email?: string;
  open: boolean;
  handleClose: () => void;
  confirmed?: boolean;
  message: string;
};

export const ModalAuth: FC<ModalAuthProps> = ({
  email,
  open,
  handleClose,
  message,
  confirmed,
}) => {
  console.log(confirmed);
  const [emailRepeat] = useEmailRepeatMutation();
  const repeatEmailHandler = async () => {
    try {
      const value = { email: email };

      // @ts-ignore
      await emailRepeat(value);
      handleClose();
    } catch (err) {
      console.log('error repeat send email');
    }
  };
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        className="relative z-[60] bg-green-100"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
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
            className="fixed inset-0 bg-[#6B7280BF] bg-opacity-75"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 rounded-lg flex tablet:items-center items-end justify-center">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="max-w-[288px] tablet:max-w-[384px] w-full mx-auto rounded-lg flex justify-center flex-col">
              <div className="relative pt-10 bg-softGreen rounded-lg">
                <div
                  className="absolute top-2 right-2 cursor-pointer text-gray-80 p-1 "
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <CloseIcon className="w-3 h-3 tablet:w-4 tablet:h-4  " />
                </div>
                <div className="bg-white px-4 py-6">
                  <p className="text-dispS2 tablet:text-dispL text-dark-100 font-bold text-center mb-6">
                    {JSON.stringify(message, null, 2).replace(/["']/g, '')}
                  </p>
                  {confirmed || confirmed === undefined ? null : (
                    <Button
                      text={'RESEND CONFIRMATION EMAIL'}
                      onClick={repeatEmailHandler}
                      type={'button'}
                    />
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};