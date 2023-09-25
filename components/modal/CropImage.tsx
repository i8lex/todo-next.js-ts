/* eslint-disable @next/next/no-img-element */
import React, { FC, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/Button';
import { SizeSlider } from '@/components/ui/SizeSlider';
import { canvasPreview } from '@/utils/image/canvasPreview';
import { useDebounceEffect } from '@/utils/useDebounceEffect';

import type { Crop, PixelCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setImage } from '@/redux/slices/images.slice';

export type CropCoverImageModalProps = {
  className?: string;
};
export const CropCoverImage: FC<CropCoverImageModalProps> = ({}) => {
  const [scale, setScale] = useState(1);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const image = useAppSelector((state) => state.image.image);
  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          width: 150,
          height: 150,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    );
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        await canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
        );
      }
    },
    100,
    [completedCrop, scale],
  );

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };
  const dispatch = useAppDispatch();
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center  tablet:py-6">
        <div className="mx-auto w-full tablet:w-fit">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={image.buffer!}
              style={{ transform: `scale(${scale})` }}
              onLoad={onImageLoad}
              className="w-[345px]"
            />
          </ReactCrop>
          <canvas ref={previewCanvasRef} hidden />
        </div>
        <div className="w-full tablet:w-[345px]">
          <SizeSlider value={scale} onChange={setScale} />
        </div>
      </div>
      <div className="  flex w-full flex-row space-x-4 border-t border-stroke   p-4 relative tablet:ml-0 tablet:justify-end">
        <Button
          text="Cancel"
          variant="white"
          size="base"
          type={'button'}
          className="w-full tablet:w-auto"
          onClick={() =>
            dispatch(
              setImage({
                ...image,
                isCropMode: false,
              }),
            )
          }
        />
        <Button
          text="Crop"
          variant="yellow"
          type={'button'}
          className="w-full tablet:w-auto"
          size="base"
          onClick={async () => {
            if (!previewCanvasRef.current) {
              console.error('Crop canvas does not exist');
              return;
            }

            await previewCanvasRef.current?.toBlob(async (newBlob) => {
              if (newBlob) {
                const reader = new FileReader();

                reader.addEventListener('load', () => {
                  dispatch(
                    setImage({
                      ...image,
                      buffer: reader.result?.toString() || '',
                      isCropMode: false,
                    }),
                  );
                });
                reader.readAsDataURL(newBlob);
              }
            });
          }}
        />
      </div>
    </div>
  );
};
