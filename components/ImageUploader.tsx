import React, { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAddImageMutation } from '@/redux/api/images.api';
import { setModalThumbsNeedRefetch } from '@/redux/slices/images.slice';
import { useAppDispatch } from '@/redux/hooks';
// import {Image, Images} from "@/types";
import UploadIcon from '@/public/IconsSet/upload-cloud-02.svg';
import { Spinner } from '@/components/ui/Spinner';
type ImageUploaderProps = {
  _id: string;
  setIsGetImages: React.Dispatch<React.SetStateAction<boolean>>;
};

// type Image ={
//   path: string;
//   lastModified: number;
//   lastModifiedDate: Date;
//   name: string;
//   size: number;
//   type: string;
//   webkitRelativePath: string;
// }

export const ImageUploader: FC<ImageUploaderProps> = ({
  _id,
  setIsGetImages,
}) => {
  const [isUploadSuccess, setIsUploadIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useAppDispatch();
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
      },
      maxFiles: 4,
      maxSize: 6 * 1024 * 1024,
      onDrop: (acceptedFiles) => {
        uploadImages(acceptedFiles).then();
      },
    });

  const [addImage, { isLoading, isSuccess }] = useAddImageMutation();

  const uploadImages = async (files: File[]) => {
    try {
      const body: FormData = new FormData();

      files.forEach((file) => {
        body.append('images', file);
      });

      body.append('event', _id);

      if (!fileRejections.length && files.length) {
        // @ts-ignore
        await addImage(body);
        dispatch(setModalThumbsNeedRefetch(true));
        setIsGetImages(true);
      }

      // setIsGetImages(true);
    } catch (error) {
      console.log(error);
    }
  };

  // const uploadImages = async (files: File[]) => {
  //   try {
  //     const body: FormData = new FormData();
  //     files.forEach((file) => {
  //       body.append("files", file);
  //     });
  //
  //     body.append("task", _id);
  //
  //     const imageArray = Array.from(body.getAll("files"));
  //     const payload = { files: imageArray, task: _id };
  //
  //     console.log(payload);
  //
  //     if (!fileRejections.length && files.length) {
  //       await addImage(payload);
  //       dispatch(setModalThumbsNeedRefetch(true));
  //       setIsGetImages(true);
  //     }
  //
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // if (!fileRejections.length) {
  //   setIsGetImages(false);
  //   console.log("OK");
  // }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess) {
      setIsUploadIsSuccess(isSuccess);
      timer = setTimeout(() => {
        setIsUploadIsSuccess(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isSuccess]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!!fileRejections.length) {
      setIsError(true);
      setIsGetImages(false);
      timer = setTimeout(() => {
        setIsError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [!!fileRejections.length]);

  return (
    <div
      className="p-3 h-full flex flex-col items-center justify-center"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isError ? (
        <>
          <p className="text-dark-100 text-center text-parM">Error!</p>
          <p className="text-dark-100 text-center text-parM">
            You can upload 4 files, no larger than 4mb!
          </p>
        </>
      ) : isUploadSuccess ? (
        <p className="text-dark-100 text-center text-parM">Upload successful</p>
      ) : isLoading ? (
        <Spinner className="fill-green-20 text-green-60" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-dark-100 text-center text-parM font-semibold">
            You can drop images here
          </p>
          <div className="flex items-center justify-center flex-col w-[70px] h-[70px] border border-stroke rounded-md hover:shadow-sm hover:shadow-dark-60 hover:bg-green-10 cursor-pointer shadow-md shadow-dark-60">
            <UploadIcon className="w-[50px] h-[50px] text-dark-100" />
          </div>
        </div>
      )}
    </div>
  );
};
