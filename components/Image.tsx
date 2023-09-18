import React from 'react';
import { useGetImageQuery } from '@/redux/api/images.api';
import { useAppSelector } from '@/redux/hooks';

export const Image = () => {
  const { imageId, mimetype, thumb, filename } = useAppSelector(
    (state) => state.image.image,
  );
  const {
    data: image,
    isLoading,
    isError,
  } = useGetImageQuery(imageId!, {
    skip: !imageId,
  });
  if (isLoading) {
    return (
      <div className="image__imageBox">
        <img
          src={`data:${mimetype};base64,${thumb?.toString()}`}
          alt={filename!}
          className="image__imageBox__img"
        />
      </div>
    );
  }
  if (isError) {
    return <p>Error loading image</p>;
  }

  return (
    <div className="image__imageBox">
      {image ? (
        <img
          src={`data:${image.mimetype};base64,${image.image.toString()}`}
          alt={image.filename}
          className="image__imageBox__img"
        />
      ) : null}
    </div>
  );
};
