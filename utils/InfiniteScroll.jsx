import { useCallback } from "react";

//Last item guard for infinite scrolling lists - if it gets in the viewport calls callback
//** usecase: **
//const lastItemRef = lastItem(*new useRef object*, *isLoading variable*, *hasMore variable*, *callback to load more*, [recall-triggers]);
// <div ref={lastItemRef}>
export function lastItem(observer, isLoading, hasMore, callback, dependencies) {
  const fn = useCallback(
    (item) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        { threshold: 0.5 }
      );
      if (item) observer.current.observe(item);
    },
    [...dependencies]
  );

  return fn;
}

//Observes if an element is in the viewport or not, and fires a callback if so
//** usecase: **
//const ref = InViewportItem(*new useRef object*, *callback*, options? = {*only fire once*, *0 to 1 value for how much should be in the viewport*});
// <div ref={ref}>
export function InViewportItem(observer, callback, options = {}) {
  const { callOnce = true, threshold = 0.5 } = options;
  const fn = useCallback((item) => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
          if (callOnce) observer.current.disconnect();
        }
      },
      { threshold: threshold }
    );
    if (item) observer.current.observe(item);
  }, []);

  return fn;
}
