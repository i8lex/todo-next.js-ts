import React, {FC, useEffect, useState} from "react";
import { useDropzone } from "react-dropzone";
import { useAddImageMutation } from "@/redux/api/images.api";
import { setModalThumbsNeedRefetch } from "@/redux/slices/images.slice";
import { useAppDispatch } from "@/redux/hooks";
// import {Image, Images} from "@/types";

type ImageUploaderProps = {
  _id: string
  setIsGetImages: React.Dispatch<React.SetStateAction<boolean>>;
}


// type Image ={
//   path: string;
//   lastModified: number;
//   lastModifiedDate: Date;
//   name: string;
//   size: number;
//   type: string;
//   webkitRelativePath: string;
// }

export const ImageUploader: FC<ImageUploaderProps> = ({ _id, setIsGetImages }) => {
  const [isUploadSuccess, setIsUploadIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useAppDispatch();
  const {
    isDragAccept,
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 4,
    maxSize: 6 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      uploadImages(acceptedFiles);
    },
  });

  const [addImage, { isLoading, isSuccess }] = useAddImageMutation()


  const uploadImages = async (files: File[]) => {
    try {
      const body: FormData = new FormData();
      console.log(files)

      files.forEach((file) => {
        body.append("images", file);
      });

      body.append("task", _id);
      console.log(body);


      if (!fileRejections.length && files.length) {
        console.log("done")
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
    let timer: NodeJS.Timeout ;
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
    <div className="image__uploadBox" {...getRootProps()}>
      <input {...getInputProps()} />
      {isError ? (
        <>
          <p className="image__loadingBoxTitle">Error!</p>
          <p className="image__loadingBoxTitle">
            You can upload 4 files, no larger than 4mb!
          </p>
        </>
      ) : isUploadSuccess ? (
        <p className="image__uploadBoxSmall__title">Upload successful</p>
      ) : isLoading ? (
        <div className="image__loadingWrapper">
          <p className="image__loadingBoxTitle">...Uploading...</p>
          {acceptedFiles.map((file) => (
            <div className="image__loadingBox" key={file.name}>
              <img
                className="image__loadingBox__tempThumbs"
                alt={file.name}
                src={URL.createObjectURL(file as Blob)}
                onLoad={() => {
                  URL.revokeObjectURL(file as unknown as string);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="image__uploadBoxSmall__title">
          You can drop your images here
        </p>
      )}
    </div>
  );
};
