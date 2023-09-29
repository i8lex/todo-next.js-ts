import React, { FC, Fragment } from 'react';
import { useEmailRepeatMutation } from '@/redux/api/auth.api';
import { Dialog, Transition } from '@headlessui/react';
import CloseIcon from '@/public/IconsSet/power-01.svg';
import { Button } from '@/components/ui/Button';
import AlertIcon from '@/public/IconsSet/exclamation.svg';
import * as process from 'process';

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
  const [emailRepeat] = useEmailRepeatMutation();
  const repeatEmailHandler = async () => {
    try {
      if (email) {
        const response = await emailRepeat({ email });
        if ('data' in response) {
          const { data } = response;
          console.log(data);
          fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              console.log(response.json());
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      }
    } catch (err) {
      console.log('error repeat send email');
    }
    // await handleClose();
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
            <Dialog.Panel className="max-w-[288px] max-h-screen h-[50vh] tablet:max-w-[384px] w-full mx-auto rounded-lg flex justify-center flex-col">
              <div className="relative pt-10 pb-6 mb-6 bg-softGreen rounded-xl h-full ">
                <div
                  className="absolute top-2 right-2 cursor-pointer text-gray-80 p-1 "
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <CloseIcon className="w-3 h-3 tablet:w-4 tablet:h-4  " />
                </div>
                <div className="bg-white shadow-inner shadow-dark-60 rounded-xl h-full mx-4 p-4 flex flex-col gap-2 tablet:gap-4 items-center">
                  {confirmed || confirmed === undefined ? null : (
                    <div className="text-yellow-100 p-4 border border-stroke rounded-md shadow-inner shadow-dark-60">
                      <AlertIcon className="w-8 h-8 " />
                    </div>
                  )}
                  <p className="text-parL h-full tablet:text-dispS3 flex flex-col items-center justify-center text-dark-100 font-bold text-center mb-6">
                    {message}
                  </p>
                  {email ? (
                    <>
                      <p className="text-parM h-full text-dark-80 tablet:text-parL flex flex-col items-center justify-center  font-semibold text-center mb-6">
                        We have sent you message to{' '}
                        <span className="font-bold text-dispS3 text-dark-100 tablet:text-dispS2">
                          {email}
                        </span>{' '}
                      </p>
                      <p className="text-parM h-full tablet:text-dispS3 flex flex-col items-center justify-center text-dark-80 font-semibold text-center mb-6">
                        Please follow the link inside
                      </p>
                    </>
                  ) : null}
                  {confirmed || confirmed === undefined ? null : (
                    <Button
                      className="!text-quot"
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
