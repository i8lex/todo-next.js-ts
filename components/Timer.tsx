import React, { useState, useEffect, FC } from 'react';
import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInMilliseconds,
} from 'date-fns';

type TimerProps = {
  deadline: string;
};

export const Timer: FC<TimerProps> = ({ deadline }) => {
  const [remainingTime, setRemainingTime] = useState<number | null | string>(
    null,
  );
  const [remainingTimeClock, setRemainingTimeClock] = useState<number | null>(
    null,
  );
  const [animation, setAnimation] = useState(' ');
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(animation === ' ' ? ':' : ' ');
    }, 1000);
    return () => clearInterval(intervalId);
  }, [animation]);

  useEffect(() => {
    if (deadline !== 'Not set') {
      const deadlineDate = new Date(deadline);
      const intervalId = setInterval(() => {
        const now = new Date();
        const remainingTimeInMs = differenceInMilliseconds(deadlineDate, now);
        if (remainingTimeInMs < 0) {
          clearInterval(intervalId);
          setRemainingTimeClock(0);
        } else {
          setRemainingTimeClock(remainingTimeInMs);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [deadline]);

  useEffect(() => {
    if (deadline !== 'Not set') {
      const deadlineDate = parseISO(deadline);
      const intervalId = setInterval(() => {
        const now = new Date();
        const remainingTimeInMs = deadlineDate.getTime() - now.getTime();
        if (remainingTimeInMs < 0) {
          clearInterval(intervalId);
          setRemainingTime(0);
        } else {
          const remainingTime = formatDistanceToNowStrict(deadlineDate, {
            addSuffix: true,
            // includeSeconds: true,
          });
          setRemainingTime(remainingTime);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [deadline]);

  const seconds = Math.floor(((remainingTimeClock ?? 0) / 1000) % 60);
  const minutes = Math.floor(((remainingTimeClock ?? 0) / (1000 * 60)) % 60);
  const hours = Math.floor(((remainingTimeClock ?? 0) / (1000 * 60 * 60)) % 24);
  const days = Math.floor((remainingTimeClock ?? 0) / (1000 * 60 * 60 * 24));

  return deadline !== '1970-01-01T00:00:00.000Z' ? (
    <div className="w-[50px] tablet:w-[85px] flex flex-col items-center gap-1">
      <p className="text-dark-60 tablet:text-parS text-[8px] font-normal text-center !leading-none">
        Remaining time:
      </p>
      {days >= 1 ? (
        <p className="text-dark-100 text-[10px]  tablet:text-parM font-bold">
          {remainingTime}
        </p>
      ) : (
        <>
          {typeof remainingTime === 'number' && remainingTime <= 0 ? (
            <p className="text-error-100 text-[8px] tablet:text-parM font-bold">
              TIME IS UP
            </p>
          ) : (
            <div className="relative text-quot tablet:text-[20px] leading-none text-center font-digital bg-[#CEE7CE] border border-stroke shadow-sm shadow-dark-60 rounded-[3px]">
              <p className="py-0.5 px-1 tablet:py-2 tablet:px-4 text-gray-60">
                88:88:88
              </p>
              <p className="absolute top-0 left-0 py-0.5 px-1 tablet:py-2 tablet:px-4 text-dark-100">{` ${hours
                .toString()
                .padStart(2, '\u2007\u2007')}${animation}${minutes
                .toString()
                .padStart(2, '0')}${animation}${seconds
                .toString()
                .padStart(2, '0')}`}</p>
            </div>
          )}
        </>
      )}
    </div>
  ) : null;
};
