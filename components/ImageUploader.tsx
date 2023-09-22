import React, { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  useAddImageMutation,
  useLazyGetThumbsQuery,
} from '@/redux/api/images.api';
import { useLazyGetEventsQuery } from '@/redux/api/events.api';
import { setImage } from '@/redux/slices/images.slice';
import AlertIcon from '@/public/IconsSet/exclamation.svg';

import { useAppDispatch } from '@/redux/hooks';
import UploadIcon from '@/public/IconsSet/upload-cloud-02.svg';
import { Spinner } from '@/components/ui/Spinner';
type ImageUploaderProps = {
  _id?: string;
  maxFiles?: number;
  maxSize?: number;
};

export const ImageUploader: FC<ImageUploaderProps> = ({
  _id,
  maxSize = 6 * 1024 * 1024,
  maxFiles = 4,
}) => {
  const [isUploadSuccess, setIsUploadIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [triggerGetThumbs] = useLazyGetThumbsQuery();
  const [triggerGetEvents] = useLazyGetEventsQuery();
  const dispatch = useAppDispatch();
  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: maxFiles,
    maxSize: maxSize,
    onDrop: (acceptedFiles) => {
      uploadImages(acceptedFiles).then();
    },
  });

  const [addImage, { isLoading, isSuccess }] = useAddImageMutation();

  const uploadImages = async (files: File[]) => {
    try {
      if (maxFiles > 1 && _id) {
        const body: FormData = new FormData();
        files.forEach((file) => {
          body.append('images', file);
        });
        body.append('event', _id);
        if (!fileRejections.length && files.length) {
          // @ts-ignore
          await addImage(body);
        }
      } else {
        console.log(files);
        if (files && files.length > 0) {
          const reader = new FileReader();
          const file = files[0];

          reader.addEventListener('load', () => {
            dispatch(
              setImage({
                filename: file.name,
                buffer: reader.result?.toString() || '',
                mimetype: file.type,
              }),
            );
          });
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess && _id) {
      setIsUploadIsSuccess(isSuccess);
      triggerGetEvents(undefined, false);
      triggerGetThumbs(_id, false);
    }
  }, [isSuccess]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (fileRejections.length) {
      setIsError(true);
      timer = setTimeout(() => {
        setIsError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [fileRejections.length]);

  return (
    <div
      className="p-3 h-full flex flex-col items-center justify-center"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isError ? (
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="text-yellow-100 flex flex-col items-center justify-center py-2 px-4 border border-stroke rounded-md shadow-inner shadow-dark-60">
            <AlertIcon className="w-8 h-8 " />
            <p className="text-errorText text-center text-parM">Error!</p>
          </div>

          <p className="text-dark-100 text-center font-semibold text-parM">
            {maxFiles > 1
              ? 'You can upload 4 files, no larger than 6mb!'
              : 'You can upload 1 files, no larger than 2mb!'}
          </p>
        </div>
      ) : isUploadSuccess ? (
        <p className="text-dark-100 text-center text-parM font-semibold">
          Upload successful
        </p>
      ) : isLoading ? (
        <Spinner className="fill-green-20 text-green-60" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-dark-100 text-center text-parM font-semibold">
            {maxFiles > 1
              ? 'You can drop images here'
              : 'You can drop avatar here'}
          </p>
          <div className="flex items-center justify-center flex-col w-[70px] h-[70px] border border-stroke rounded-md hover:shadow-sm hover:shadow-dark-60 hover:bg-green-10 cursor-pointer shadow-md shadow-dark-60">
            <UploadIcon className="w-[50px] h-[50px] text-dark-100" />
          </div>
        </div>
      )}
    </div>
  );
};
