import { type FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DeleteIcon from '../../public/IconsSet/exclamation.svg';

type DeleteConfirmModalProps = {
  showDeleteConfirmModal: boolean | undefined;
  setShowDeleteConfirmModal: (flag: boolean) => void;
  Action: () => void;
  titleText: string;
  messageText: string;
  buttonText: string;
};

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  showDeleteConfirmModal,
  setShowDeleteConfirmModal,
  Action,
  titleText,
  messageText,
  buttonText,
}) => {
  const handleAction = () => {
    Action();
    setShowDeleteConfirmModal(false);
  };
  return (
    <>
      <Transition show={showDeleteConfirmModal} as={Fragment}>
        <Dialog
          open={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          className="relative z-[60] bg-green-100"
        >
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

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center">
              <Dialog.Panel className="mx-auto bg-softGreen h-screen tablet:h-fit flex items-center w-full gap-4 rounded-lg p-4 tablet:max-w-[512px] ">
                <div className=" bg-white w-full h-full p-4 flex flex-col items-center justify-center tablet:justify-between rounded-md  shadow-inner shadow-dark-60 border border-stroke">
                  <div className="flex items-center gap-4 w-full">
                    <div className="hidden h-full tablet:block text-error-100">
                      <DeleteIcon
                        className={
                          'h-20 w-20 p-4 border border-error-40 rounded-md shadow-inner shadow-dark-60'
                        }
                      />
                    </div>
                    <div className="flex w-full flex-col h-full justify-between items-center gap-4">
                      <div className="flex justify-center items-center h-full tablet:hidden text-error-100">
                        <DeleteIcon
                          className={
                            'h-40 w-40 p-4 border border-error-40 rounded-md shadow-inner shadow-dark-60'
                          }
                        />
                      </div>
                      <div className="flex h-full flex-col gap-2">
                        <Dialog.Title className="text-parL font-medium text-darkSkyBlue-100">
                          {titleText}
                        </Dialog.Title>
                        <p className=" text-parS font-normal text-darkSkyBlue-80">
                          {messageText}
                        </p>
                      </div>

                      <div className="flex w-full justify-end gap-2 tablet:gap-4 ">
                        <button
                          type="button"
                          className="font-medium shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 text-dark-100 py-2 px-4 bg-white hover:border-gray-80 border border-gray-60 rounded-md w-full tablet:w-[150px]"
                          onClick={() => setShowDeleteConfirmModal(false)}
                        >
                          {'Cancel'}
                        </button>
                        <button
                          type="button"
                          className="font-medium text-errorText py-2 px-4 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 bg-white border border-error-40 hover:border-error-100 rounded-md w-full tablet:w-[150px]"
                          onClick={handleAction}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
