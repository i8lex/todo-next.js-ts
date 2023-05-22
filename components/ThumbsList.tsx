import React, { useEffect, useState } from "react";
import { useGetThumbsQuery } from "../redux/api/images.api";
import { ModalThumbsList } from "./ModalThumbsList";
import { ImageUploader } from "./ImageUploader";
import {
  setImage,
  setModalThumbsNeedRefetch,
  setThumbsNeedRefetch,
} from "../redux/slices/images.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const ThumbsList = ({ _id, images }) => {
  const dispatch = useAppDispatch();
  const [isThumbsOpen, setIsThumbsOpen] = useState(false);
  const [isGetImages, setIsGetImages] = useState(false);
  const { data = [], refetch, isLoading } = useGetThumbsQuery(_id);
  const { modalThumbsNeedRefetch } = useAppSelector((state) => state.image);

  useEffect(() => {
    if (isGetImages && !!images.length) {
      refetch();
    }
  }, [images, refetch]);

  useEffect(() => {
    if (modalThumbsNeedRefetch) {
      refetch();
      setTimeout(() => {
        dispatch(setModalThumbsNeedRefetch(false));
      }, 100);
    }
  }, [modalThumbsNeedRefetch, refetch]);

  if (isLoading) {
    return <h3>...LOADING...</h3>;
  }

  const modalThumbsHandler = () => {
    setIsThumbsOpen(!isThumbsOpen);
  };

  const handleFileSelect = (files) => {
    console.log(files);
  };

  return (
    <>
      {!isGetImages && !images.length ? (
        <div className="image__uploadBoxSmall">
          <ImageUploader
            setIsGetImages={setIsGetImages}
            onFileSelect={handleFileSelect}
            _id={_id}
          />
        </div>
      ) : (
        <ul className="tasks__item__thumbsWrapper">
          {data.slice(0, 3).map(({ thumb, mimetype, _id, image, filename }) => {
            return (
              <li
                className="tasks__item__thumbBox"
                key={_id}
                onClick={() => {
                  dispatch(
                    setImage({ imageId: image, mimetype, thumb, filename })
                  );
                  modalThumbsHandler();
                }}
              >
                <img
                  alt={filename}
                  className="tasks__item__thumb"
                  src={`data:${mimetype};base64,${thumb.toString("base64")}`}
                />
              </li>
            );
          })}
          <li
            className="tasks__item__thumbsMore"
            onClick={() => {
              modalThumbsHandler();
              dispatch(setImage({}));
            }}
          >
            <></>
          </li>
        </ul>
      )}
      <ModalThumbsList
        images={images}
        data={data}
        isThumbsOpen={isThumbsOpen}
        modalThumbsHandler={modalThumbsHandler}
        setIsGetImages={setIsGetImages}
        _id={_id}
      />
    </>
  );
};
