import React from 'react';
import { useGetImageQuery } from '@/redux/api/images.api';
import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
export const ImageComponent = () => {
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
      <div className="flex items-center aspect-square justify-center w-full h-[50vh] p-4">
        <Image
          width={400}
          height={400}
          priority={true}
          src={`data:${mimetype};base64,${thumb?.toString()}`}
          alt={filename!}
          className="w-[40vh] h-[40vh] aspect-square object-cover rounded-md"
        />
      </div>
    );
  }
  if (isError) {
    return <p>Error loading image</p>;
  }

  return (
    <div className="flex items-center  aspect-square justify-center w-full h-[50vh] p-4">
      {image ? (
        <div className="p-4 bg-white rounded-md border border-stroke shadow-inner shadow-dark-60">
          <Image
            width={400}
            height={400}
            priority={false}
            src={`data:${image.mimetype};base64,${image.image.toString()}`}
            alt={image.filename}
            className="w-[40vh] h-[40vh] aspect-square object-cover rounded-md"
          />
        </div>
      ) : null}
    </div>
  );
};
