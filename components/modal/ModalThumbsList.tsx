import React, { FC, Fragment, useState } from 'react';
import { clearCheckedImages, setImage } from '@/redux/slices/images.slice';
import { ImageUploader } from '../ImageUploader';
import Image from 'next/image';
import { ImageComponent } from '../ui/ImageComponent';
import Checkbox from '../ui/CheckBox';
import CloseIcon from '@/public/IconsSet/power-01.svg';
import EditIcon from '@/public/IconsSet/edit-05.svg';
import TrashIcon from '@/public/IconsSet/trash-01.svg';
import UploadIcon from '@/public/IconsSet/upload-cloud-02.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Mousewheel, Keyboard } from 'swiper/modules';

import {
  useDeleteImageMutation,
  useLazyGetThumbsQuery,
} from '@/redux/api/images.api';
import { useLazyGetEventsQuery } from '@/redux/api/events.api';
import { DeleteConfirmModal } from '../modal/DeleteConfirmModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Image as ImageTypes } from '@/types';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';

type ModalThumbsListProps = {
  thumbs: ImageTypes[];
  isThumbsOpen: boolean;
  modalThumbsHandler: any;
  _id: string;
};

export const ModalThumbsList: FC<ModalThumbsListProps> = ({
  thumbs,
  isThumbsOpen,
  modalThumbsHandler,
  _id: taskId,
}) => {
  const [deleteImage] = useDeleteImageMutation();
  const [getThumbsTrigger] = useLazyGetThumbsQuery();
  const [getEventsTrigger] = useLazyGetEventsQuery();
  const [isButtonModifyActive, setIsButtonModifyActive] = useState(false);

  const dispatch = useAppDispatch();
  const { imageId } = useAppSelector((state) => state.image.image);
  const checkedImages = useAppSelector((state) => state.image.checkedImages);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const buttonModifyHandle = () => {
    isButtonModifyActive && dispatch(clearCheckedImages());
    setIsButtonModifyActive(!isButtonModifyActive);
  };

  return (
    <>
      <Transition show={isThumbsOpen} as={Fragment}>
        <Dialog
          open={isThumbsOpen}
          onClose={() => {
            dispatch(
              setImage({
                imageId: null,
                mimetype: null,
                thumb: null,
                filename: null,
              }),
            );
            modalThumbsHandler();
            dispatch(clearCheckedImages());
            setIsButtonModifyActive(false);
          }}
          className="relative z-50"
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
              <Dialog.Panel className="h-full  tablet:h-[80vh] w-screen overflow-hidden overflow-y-auto bg-white text-parL font-medium text-darkSkyBlue-100 tablet:m-auto tablet:w-[720px] tablet:rounded-3xl">
                <div className="flex items-center justify-between border-y border-y-stroke bg-softGreen px-4 py-3.5 tablet:border-t-0 tablet:px-6 tablet:py-4">
                  <Dialog.Title className="w-full">
                    <div className="flex items-center gap-1 justify-between w-full">
                      <p className="text-parL text-darkSkyBlue-100">
                        Event images
                      </p>
                      <div className="flex gap-4">
                        <div
                          className={clsx(
                            isButtonModifyActive ? 'flex' : 'hidden',
                            'p-1 border w-[30px] h-[30px] border-stroke rounded-md  flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 shadow-md shadow-dark-60 bg-yellow-10',
                          )}
                          onClick={() => setShowDeleteConfirmModal(true)}
                        >
                          <TrashIcon className="w-[20px] h-[20px] text-dark-80" />
                        </div>
                        <div
                          className={clsx(
                            isButtonModifyActive
                              ? 'hover:bg-yellow-40  shadow-sm shadow-dark-60 bg-yellow-20'
                              : 'hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 shadow-md shadow-dark-60 bg-yellow-10',
                            'p-1 border w-[30px] h-[30px] border-stroke rounded-md flex flex-col gap-1 cursor-pointer ',
                          )}
                          onClick={buttonModifyHandle}
                        >
                          <EditIcon className="w-[20px] h-[20px] text-dark-80" />
                        </div>

                        <div
                          className="p-1 border w-[30px] h-[30px] border-stroke rounded-md flex flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 shadow-md shadow-dark-60 bg-yellow-10"
                          onClick={() => {
                            dispatch(
                              setImage({
                                imageId: null,
                                mimetype: null,
                                thumb: null,
                                filename: null,
                              }),
                            );
                            modalThumbsHandler();
                            dispatch(clearCheckedImages());
                            setIsButtonModifyActive(false);
                          }}
                        >
                          <CloseIcon className="w-[20px] h-[20px] text-dark-80" />
                        </div>
                      </div>
                    </div>
                  </Dialog.Title>
                </div>

                <div className="shadow-inner tablet:h-[72vh] h-[90vh] shadow-dark-60 flex flex-col">
                  <div className="border-b p-4 border-stroke">
                    <Swiper
                      cssMode={true}
                      effect="fade"
                      spaceBetween={16}
                      slidesPerView={4}
                      direction={'horizontal'}
                      mousewheel={true}
                      keyboard={true}
                      modules={[Mousewheel, Keyboard]}
                      className="mySwiper"
                      breakpoints={{
                        0: {
                          slidesPerView: 3,
                        },

                        768: {
                          slidesPerView: 4,
                        },
                      }}
                    >
                      <SwiperSlide
                        onClick={() =>
                          dispatch(
                            setImage({
                              imageId: null,
                              mimetype: null,
                              thumb: null,
                              filename: null,
                            }),
                          )
                        }
                        className="flex flex-col items-center justify-center rounded-md p-2 bg-yellow-10 w-[100px] h-[100px] border border-stroke tablet:w-[150px] tablet:h-[150px] overflow-hidden shadow-inner shadow-dark-60"
                      >
                        <div className="p-1 mx-auto my-5  border items-center justify-center w-[75px] h-full shadow-sm shadow-dark-60 border-stroke rounded-md flex flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-inner hover:shadow-dark-60  bg-yellow-10">
                          <UploadIcon className=" w-[50px] h-[50px] text-dark-80" />
                        </div>
                      </SwiperSlide>
                      {thumbs.map((thumb) => {
                        return (
                          <SwiperSlide
                            key={thumb._id}
                            className="relative rounded-md cursor-pointer border border-stroke p-2 bg-yellow-10 w-[100px] h-[100px]  tablet:w-[150px] tablet:h-[150px] overflow-hidden shadow-inner shadow-dark-60"
                          >
                            <Image
                              className="object-fit mx-auto flex rounded-md w-[85px] h-[85px] overflow-hidden tablet:w-[135px] tablet:h-[135px]"
                              priority={true}
                              width={100}
                              height={100}
                              src={`data:${
                                thumb.mimetype
                              };base64,${thumb.thumb.toString()}`}
                              alt={thumb.filename}
                              onClick={() => {
                                dispatch(
                                  setImage({
                                    imageId: thumb.image,
                                    mimetype: thumb.mimetype,
                                    thumb: thumb.thumb,
                                    filename: thumb.filename,
                                  }),
                                );
                              }}
                            />
                            {isButtonModifyActive && (
                              <Checkbox
                                className="absolute top-1 right-1"
                                itemId={thumb.image}
                                variant={'image'}
                              />
                            )}
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                  <div className="flex bg-yellow-10 h-full border-b m-4 rounded-xl border-stroke shadow-sm shadow-dark-60  flex-col items-center justify-center">
                    {!imageId ? (
                      <ImageUploader _id={taskId} />
                    ) : (
                      <ImageComponent />
                    )}
                  </div>
                  <DeleteConfirmModal
                    buttonText={'Delete'}
                    titleText={'Delete image?'}
                    messageText={'Are you sure you want to delete this image?'}
                    showDeleteConfirmModal={showDeleteConfirmModal}
                    setShowDeleteConfirmModal={setShowDeleteConfirmModal}
                    Action={async () => {
                      await deleteImage(checkedImages);
                      await getThumbsTrigger(taskId, false);
                      await getEventsTrigger(undefined, false);
                      dispatch(clearCheckedImages());
                      setShowDeleteConfirmModal(false);
                    }}
                  />
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
