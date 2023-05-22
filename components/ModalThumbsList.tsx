import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { clearCheckedImages, setImage } from "../redux/slices/images.slice";
import { Image } from "./Image";
import { ImageUploader } from "./ImageUploader";
import ImagesCheckbox from "./ImagesCheckbox";
import { useDeleteImageMutation } from "../redux/api/images.api";
import { ModalDeleteConfirm } from "./ModalDeleteConfirm";
import { usePathTaskMutation } from "../redux/api/tasks.api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

Modal.setAppElement("#__next");

export const ModalThumbsList = ({
  data: thumb,
  isThumbsOpen,
  modalThumbsHandler,
  setIsGetImages,
  _id: taskId,
  images,
}) => {
  const [deleteImage] = useDeleteImageMutation();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    title: "",
  });
  const [isButtonModifyActive, setIsButtonModifyActive] = useState(false);
  const [buttonModifyClassName, setButtonModifyClassName] =
    useState("image__modify");

  const dispatch = useAppDispatch();
  const { imageId } = useAppSelector((state) => state.image.image);
  const { checkedImages } = useAppSelector((state) => state.image);
  const [pathTask] = usePathTaskMutation();
  const buttonModifyHandle = () => {
    isButtonModifyActive && dispatch(clearCheckedImages());
    setIsButtonModifyActive(!isButtonModifyActive);
  };

  const deleteImagesFromTaskFieldHandle = async (
    checkedImages,
    imagesIds,
    taskId
  ) => {
    const filteredImages = imagesIds.filter(
      (item) => !checkedImages.includes(item)
    );
    await pathTask({ id: taskId, body: { images: filteredImages } });
  };

  useEffect(() => {
    if (isButtonModifyActive) {
      setButtonModifyClassName("image__modifyActive");
    } else {
      setButtonModifyClassName("image__modify");
    }
  }, [isButtonModifyActive]);

  return (
    <Modal
      isOpen={isThumbsOpen}
      onRequestClose={() => {
        dispatch(setImage({}));
        modalThumbsHandler();
        dispatch(clearCheckedImages());
        setIsGetImages(false);
        setIsButtonModifyActive(false);
      }}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        content: {
          maxWidth: "100rem",
          maxHeight: "100rem",
          margin: "0 auto",
          border: "none",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <div className="image">
        <ul className="image__wrapper">
          <li
            onClick={() => dispatch(setImage({}))}
            className="image__thumbsBox"
          >
            <div className="image__thumbsBox__toUpload">
              <></>
            </div>
          </li>
          {thumb.map(({ thumb, mimetype, _id, filename, image }) => {
            return (
              <li key={_id} className="image__thumbsBox">
                <img
                  className="image__thumbsBox__thumb"
                  src={`data:${mimetype};base64,${thumb.toString("base64")}`}
                  alt={filename}
                  onClick={() =>
                    dispatch(
                      setImage({ imageId: image, mimetype, thumb, filename })
                    )
                  }
                />
                {isButtonModifyActive && <ImagesCheckbox imageId={image} />}
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

        <button
          className="image__close"
          type="button"
          onClick={() => {
            dispatch(setImage({}));
            modalThumbsHandler();
            dispatch(clearCheckedImages());
            setIsGetImages(false);
            setIsButtonModifyActive(false);
          }}
        >
          <></>
        </button>
        <button
          className={buttonModifyClassName}
          type="button"
          onClick={buttonModifyHandle}
        >
          <></>
        </button>
        <button
          className="image__deleteBtn"
          type="button"
          onClick={() =>
            setDeleteConfirmModal({
              isOpen: true,
              handleConfirm: async () => {
                await deleteImage(`?ids=${checkedImages}`);
                await deleteImagesFromTaskFieldHandle(
                  checkedImages,
                  images,
                  taskId
                );
                dispatch(clearCheckedImages());
              },
            })
          }
        >
          <></>
        </button>
        <ModalDeleteConfirm
          isOpen={deleteConfirmModal.isOpen}
          handleClose={() => {
            setDeleteConfirmModal((prevState) => {
              return {
                ...prevState,
                isOpen: false,
              };
            });
          }}
          handleConfirm={deleteConfirmModal.handleConfirm}
        />
      </div>
    </Modal>
  );
};
