import React, { FC, useState } from 'react';
import { toggleEvent } from '@/redux/slices/events.slice';
import { useAppDispatch } from '@/redux/hooks';
import Checkcon from '@/public/IconsSet/check.svg';
import clsx from 'clsx';
import { toggleImagesList } from '@/redux/slices/images.slice';

type CheckboxType = {
  className?: string;
  itemId: string;
  variant: string;
};
const CheckBox: FC<CheckboxType> = ({ itemId, variant, className }) => {
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    switch (variant) {
      case 'image': {
        dispatch(toggleEvent({ itemId: itemId, isChecked }));
        setIsChecked(event.target.checked);
      }
      case 'event': {
        dispatch(toggleImagesList({ imageId: itemId, isChecked }));
        setIsChecked(event.target.checked);
      }
    }
  };

  return (
    <label
      htmlFor={itemId}
      className={clsx(
        isChecked
          ? 'bg-yellow-20 shadow-sm shadow-dark-60'
          : 'shadow-md shadow-dark-60 bg-yellow-10',
        className,
        'p-1 border w-[30px] h-[30px] border-stroke rounded-md flex flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 ',
      )}
    >
      {isChecked ? (
        <Checkcon className="w-[20px] h-[20px] text-dark-80" />
      ) : null}

      <input
        id={itemId}
        name={itemId}
        hidden={true}
        className={'hidden'}
        type="checkbox"
        onChange={handleCheckboxChange}
      />
    </label>
  );
};

export default CheckBox;
