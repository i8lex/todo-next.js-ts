import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAddImageMutation } from "../redux/api/images.api";
import { useDispatch } from "react-redux";
import { setModalThumbsNeedRefetch } from "../redux/slices/images.slice";

export const ImageUploader = ({ _id, setIsGetImages }) => {
  const [isUploadSuccess, setIsUploadIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
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
    maxSize: 4 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      uploadImages(acceptedFiles);
    },
  });

  const [addImage, { isLoading, isSuccess }] = useAddImageMutation({
    onError: (error) => {
      console.error(error);
    },
  });

  const uploadImages = async (files) => {
    try {
      const body = new FormData();

      files.forEach((file) => {
        body.append("images", file);
      });

      body.append("task", _id);

      console.log(files);
      console.log(acceptedFiles);
      console.log(body);

      if (!fileRejections.length && !!files.length) {
        await addImage(body);
        dispatch(setModalThumbsNeedRefetch(true));
        setIsGetImages(true);
      }

      // setIsGetImages(true);
    } catch (error) {
      console.log(error);
    }
  };

  // if (!fileRejections.length) {
  //   setIsGetImages(false);
  //   console.log("OK");
  // }

  useEffect(() => {
    let timer;
    if (isSuccess) {
      setIsUploadIsSuccess(isSuccess);
      timer = setTimeout(() => {
        setIsUploadIsSuccess(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isSuccess]);

  useEffect(() => {
    let timer;
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
                src={URL.createObjectURL(file)}
                onLoad={() => {
                  URL.revokeObjectURL(file);
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
