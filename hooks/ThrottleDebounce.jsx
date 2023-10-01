"use client";

import { useCallback, useEffect, useRef } from "react";

//** usecase: **
// (*at top level*) useDebounce(() => myFunction(myArgs), 1000, [triggers]);
export function useDebounce(callback, delay, deps) {
  const callbackRef = useRef(callback);
  const timer = useRef(0);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  const clear = useCallback(() => {
    timer.current && clearTimeout(timer.current);
  }, []);
  const set = useCallback(() => {
    timer.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);
  useEffect(() => {
    clear();
    set();
  }, [...deps, set, clear]);
  useEffect(clear, []);
}

//** usecase: **
// myFunction(myArgs) --> const throttledFunction = useThrottle(myFunction, 1000); throttledFunction(myArgs);
export function useThrottle(callback, delay) {
  let waiting = false;
  let nextBatch = null;
  const timeout = () => {
    if (!nextBatch) waiting = false;
    else {
      callback(nextBatch);
      nextBatch = null;
      setTimeout(timeout, delay);
    }
  };

  return (...args) => {
    if (waiting) {
      nextBatch = args;
      return;
    }
    callback(...args);
    waiting = true;
    setTimeout(timeout, delay);
  };
}
