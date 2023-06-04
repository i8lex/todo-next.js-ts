import React, { FC, useEffect, useState } from "react";
import { useGetThumbsQuery } from "@/redux/api/images.api";
import { ModalThumbsList } from "./ModalThumbsList";
import { ImageUploader } from "./ImageUploader";
import {
  setImage,
  setModalThumbsNeedRefetch,
} from "@/redux/slices/images.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type ThumbListProps = {
  _id: string;
  images: string[];
};

export const ThumbsList: FC<ThumbListProps> = ({ _id, images }) => {
  const dispatch = useAppDispatch();
  const [isThumbsOpen, setIsThumbsOpen] = useState(false);
  const [isGetImages, setIsGetImages] = useState(false);
  const { data: thumbs = [], refetch, isLoading } = useGetThumbsQuery(_id);
  const { modalThumbsNeedRefetch } = useAppSelector((state) => state.image);

  useEffect(() => {
    if (isGetImages && images.length) {
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

  // const handleFileSelect = (files) => {
  //   console.log(files);
  // };

  return (
    <>
      {!isGetImages && !images.length ? (
        <div className="image__uploadBoxSmall">
          <ImageUploader setIsGetImages={setIsGetImages} _id={_id} />
        </div>
      ) : (
        <ul className="tasks__item__thumbsWrapper">
          {thumbs.slice(0, 3).map((thumb) => {
            return (
              <li
                className="tasks__item__thumbBox"
                key={thumb._id}
                onClick={() => {
                  dispatch(
                    setImage({
                      imageId: thumb.image,
                      mimetype: thumb.mimetype,
                      thumb: thumb.thumb,
                      filename: thumb.filename,
                    })
                  );
                  modalThumbsHandler();
                }}
              >
                <img
                  alt={thumb.filename}
                  className="tasks__item__thumb"
                  src={`data:${
                    thumb.mimetype
                  };base64,${thumb.thumb.toString()}`}
                />
              </li>
            );
          })}
          <li
            className="tasks__item__thumbsMore"
            onClick={() => {
              modalThumbsHandler();
              dispatch(
                setImage({
                  imageId: null,
                  mimetype: null,
                  thumb: null,
                  filename: null,
                })
              );
            }}
          >
            <></>
          </li>
        </ul>
      )}
      <ModalThumbsList
        images={images}
        thumbs={thumbs}
        isThumbsOpen={isThumbsOpen}
        modalThumbsHandler={modalThumbsHandler}
        setIsGetImages={setIsGetImages}
        _id={_id}
      />
    </>
  );
};
