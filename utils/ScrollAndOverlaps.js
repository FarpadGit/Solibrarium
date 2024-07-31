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
//const ref = inViewportItem(*new useRef object*, *callback*, options?);
// options = {callOnce: *fire only once*, threshold: *how much should be in the viewport ([0-1] value)*, root: *lower level container instead of viewport*});
// <div ref={ref}>
export function inViewportItem(observer, callback, options = {}) {
  const { callOnce = true, threshold = 0.5, root = undefined } = options;
  const fn = useCallback((item) => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
          if (callOnce) observer.current.disconnect();
        }
      },
      { threshold: threshold, root: root }
    );
    if (item) observer.current.observe(item);
  }, [root]);

  return fn;
}

//Compares two elements if they overlap in the viewport or not, and fires a callback if so
//** usecase: **
//const ref = checkIfOverlapping(*first element*, *callback*, *optional delay*);
// <div ref={ref}>I'm the second element</div>
export function checkIfOverlapping(element1, callback, delay = 0) {
  const fn = useCallback((element2) => {
    if(!element2) return;
    const a = element1.getBoundingClientRect();
    const b = element2.getBoundingClientRect();

    const vertical = a.top <= b.top + b.height && a.top + a.height > b.top;
    const horizontal = a.left <= b.left + b.width && a.left + a.width > b.left;

    if (vertical && horizontal) setTimeout(() => {
      callback();
    }, delay); 
  }, [element1]);
    
    return fn;
}