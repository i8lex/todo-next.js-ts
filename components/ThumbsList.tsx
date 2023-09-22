import React, { FC, useState } from 'react';
import { useGetThumbsQuery } from '@/redux/api/images.api';
import { ModalThumbsList } from './modal/ModalThumbsList';
import { ImageUploader } from './ImageUploader';
import { setImage } from '@/redux/slices/images.slice';
import { useAppDispatch } from '@/redux/hooks';
import ImageIcon from '@/public/IconsSet/image-03.svg';
type ThumbListProps = {
  _id: string;
  images: string[];
};

export const ThumbsList: FC<ThumbListProps> = ({ _id, images }) => {
  const dispatch = useAppDispatch();
  const [isThumbsOpen, setIsThumbsOpen] = useState(false);
  const { data: thumbs = [], isLoading } = useGetThumbsQuery(_id, {
    skip: !_id,
  });

  if (isLoading) {
    return <h3>...LOADING...</h3>;
  }
  const modalThumbsHandler = () => {
    setIsThumbsOpen(!isThumbsOpen);
  };
  return (
    <>
      {!images.length ? (
        <div className="w-full h-[205px] bg-softGreen border border-stroke rounded-md shadow-inner shadow-dark-60">
          <ImageUploader _id={_id} />
        </div>
      ) : (
        <div className="p-2 grid grid-cols-2 grid-rows-2 gap-1 bg-yellow-10 shadow-inner shadow-dark-60 rounded-md">
          {thumbs.slice(0, 3).map((thumb) => {
            return (
              <div
                className="p-[2px] bg-yellow-40 shadow-sm shadow-dark-60 overflow-hidden  rounded-md"
                key={thumb._id}
                onClick={() => {
                  dispatch(
                    setImage({
                      imageId: thumb.image,
                      mimetype: thumb.mimetype,
                      thumb: thumb.thumb,
                      filename: thumb.filename,
                    }),
                  );
                  modalThumbsHandler();
                }}
              >
                <img
                  alt={thumb.filename}
                  className="object-cover rounded-md w-full h-full"
                  src={`data:${
                    thumb.mimetype
                  };base64,${thumb.thumb.toString()}`}
                />
              </div>
            );
          })}
          <div
            className=" flex w-full justify-center items-center cursor-pointer p-2"
            onClick={() => {
              modalThumbsHandler();
              dispatch(
                setImage({
                  imageId: null,
                  mimetype: null,
                  thumb: null,
                  filename: null,
                }),
              );
            }}
          >
            <ImageIcon className="w-12 h-12 text-dark-100 p-2 shadow-md shadow-dark-60 rounded-md bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 hover:bg-yellow-10" />
          </div>
        </div>
      )}
      <ModalThumbsList
        images={images}
        thumbs={thumbs}
        isThumbsOpen={isThumbsOpen}
        modalThumbsHandler={modalThumbsHandler}
        // setIsGetImages={setIsGetImages}
        _id={_id}
      />
    </>
  );
};
