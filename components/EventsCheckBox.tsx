import React, { FC, useState } from 'react';
import { toggleEvent } from '@/redux/slices/events.slice';
import { useAppDispatch } from '@/redux/hooks';
import Checkcon from '@/public/IconsSet/check.svg';
import clsx from 'clsx';

type TasksCheckboxType = {
  eventId: string;
};
const EventsCheckBox: FC<TasksCheckboxType> = ({ eventId }) => {
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    dispatch(toggleEvent({ itemId: eventId, isChecked }));
    setIsChecked(event.target.checked);
    console.log(isChecked);
  };

  return (
    <label
      htmlFor={eventId}
      className={clsx(
        isChecked
          ? 'bg-yellow-20 shadow-sm shadow-dark-60'
          : 'shadow-md shadow-dark-60 bg-yellow-10',
        'p-1 border w-[30px] h-[30px] border-stroke rounded-md flex flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 ',
      )}
    >
      {isChecked ? (
        <Checkcon className="w-[20px] h-[20px] text-dark-80" />
      ) : null}

      <input
        id={eventId}
        name={eventId}
        hidden={true}
        className={'hidden'}
        type="checkbox"
        onChange={handleCheckboxChange}
      />
    </label>
  );
};

export default EventsCheckBox;
