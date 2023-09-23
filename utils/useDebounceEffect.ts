/* eslint-disable prefer-spread */
import { useEffect } from 'react';

import type { DependencyList } from 'react';

export const useDebounceEffect = (
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) => {
  useEffect(() => {
    const t = setTimeout(() => {
      //@ts-ignore
      fn.apply(undefined, deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
};
