import React, { FC, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { clearCheckedImages, setImage } from '@/redux/slices/images.slice';
import { Image } from './Image';
import { ImageUploader } from './ImageUploader';
import ImagesCheckbox from './ImagesCheckbox';
import {
  PencilSquareIcon,
  TrashIcon,
  PowerIcon,
} from '@heroicons/react/20/solid';
import { useDeleteImageMutation } from '@/redux/api/images.api';
import { ModalDeleteConfirm } from './ModalDeleteConfirm';
import { usePathEventMutation } from '@/redux/api/events.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Image as ImageTypes } from '@/types';

Modal.setAppElement('#__next');

type ModalThumbsListProps = {
  thumbs: ImageTypes[];
  isThumbsOpen: boolean;
  modalThumbsHandler: any;
  setIsGetImages: React.Dispatch<React.SetStateAction<boolean>>;
  _id: string;
  images: string[];
};

type DeleteConfirmModal = {
  isOpen: boolean;
  title: string;
  handleConfirm: () => Promise<void>;
};

export const ModalThumbsList: FC<ModalThumbsListProps> = ({
  thumbs,
  isThumbsOpen,
  modalThumbsHandler,
  setIsGetImages,
  _id: taskId,
  images,
}) => {
  const [deleteImage] = useDeleteImageMutation();
  const [deleteConfirmModal, setDeleteConfirmModal] =
    useState<DeleteConfirmModal>({
      isOpen: false,
      title: '',
      handleConfirm: async () => {},
    });
  const [isButtonModifyActive, setIsButtonModifyActive] = useState(false);
  const [buttonModifyClassName, setButtonModifyClassName] =
    useState('image__modify');

  const dispatch = useAppDispatch();
  const { imageId } = useAppSelector((state) => state.image.image);
  const { checkedImages } = useAppSelector((state) => state.image);
  const [pathEvent] = usePathEventMutation();
  const buttonModifyHandle = () => {
    isButtonModifyActive && dispatch(clearCheckedImages());
    setIsButtonModifyActive(!isButtonModifyActive);
  };

  const deleteImagesFromTaskFieldHandle = async (
    checkedImages: string[],
    imagesIds: string[],
    eventId: string,
  ) => {
    const filteredImages = imagesIds.filter(
      (item) => !checkedImages.includes(item),
    );
    await pathEvent({ id: eventId, body: { images: filteredImages } });
  };

  useEffect(() => {
    if (isButtonModifyActive) {
      setButtonModifyClassName('image__modifyActive');
    } else {
      setButtonModifyClassName('image__modify');
    }
  }, [isButtonModifyActive]);

  return (
    <Modal
      isOpen={isThumbsOpen}
      onRequestClose={() => {
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
        setTimeout(() => {
          setIsGetImages(true);
        }, 100);

        setIsButtonModifyActive(false);
      }}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        content: {
          maxWidth: '100rem',
          maxHeight: '100rem',
          margin: '0 auto',
          border: 'none',
          borderRadius: '10px',
          padding: '20px',
        },
      }}
    >
      <div className="image">
        <ul className="image__wrapper">
          <li
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
            className="image__thumbsBox"
          >
            <div className="image__thumbsBox__toUpload">
              <></>
            </div>
          </li>
          {thumbs.map((thumb) => {
            return (
              <li key={thumb._id} className="image__thumbsBox">
                <img
                  className="image__thumbsBox__thumb"
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
                  <ImagesCheckbox imageId={thumb.image} />
                )}
              </li>
            );
          })}
        </ul>
        {!imageId ? (
          <div className="image__imageBox">
            <ImageUploader _id={taskId} setIsGetImages={setIsGetImages} />
          </div>
        ) : (
          <Image />
        )}
        <div className="flex flex-col gap-4">
          <button
            type="button"
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
              setIsGetImages(false);
              setIsButtonModifyActive(false);
            }}
          >
            <PowerIcon className="h-6 w-6" />
          </button>
          <button
            className={buttonModifyClassName}
            type="button"
            onClick={buttonModifyHandle}
          >
            <PencilSquareIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() =>
              setDeleteConfirmModal({
                isOpen: true,
                title: 'Delete Confirm',
                handleConfirm: async () => {
                  await deleteImage(checkedImages);
                  await deleteImagesFromTaskFieldHandle(
                    checkedImages,
                    images,
                    taskId,
                  );
                  dispatch(clearCheckedImages());
                },
              })
            }
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>

        <ModalDeleteConfirm
          isOpen={deleteConfirmModal.isOpen}
          handleClose={() => {
            setDeleteConfirmModal((prevState) => ({
              ...prevState,
              isOpen: false,
            }));
          }}
          handleConfirm={deleteConfirmModal.handleConfirm}
        />
      </div>
    </Modal>
  );
};
