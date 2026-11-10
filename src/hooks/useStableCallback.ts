import { useCallback, useRef } from 'react';

/**
 * A function whose identity never changes but which always runs the latest version passed in.
 * Lets memoised children skip re-rendering when the parent re-renders.
 */
export const useStableCallback = <A extends unknown[], R>(fn: (...args: A) => R): ((...args: A) => R) => {
  const latest = useRef(fn);
  latest.current = fn;
  return useCallback((...args: A) => latest.current(...args), []);
};
