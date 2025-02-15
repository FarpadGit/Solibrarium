"use client";

import { useEffect, useRef } from "react";
import { useThrottle } from "@/hooks/ThrottleDebounce";
import { useSelector, useDispatch } from "react-redux";
import { 
  selector as headerVisibilitySelector, 
  reducers as headerVisibilityReducers, 
  headerCollapseAnimationDuration 
} from "@/redux/features/headerVisibility/headerVisibilitySlice";

const minScrollingDelta = 3;

//hook for resizing the header appropriately when the user scrolls
export function useScrollHandler(headerRef) {
  const { isHeaderMinimized, canHandleScroll } = useSelector(headerVisibilitySelector);
  const dispatch = useDispatch();
  const { minimizeHeader, maximizeHeader, lockHeader, unlockHeader } = headerVisibilityReducers;

  const prevScrollY = useRef(0);
  const scrollBlockTimer = useRef(0);
  
  const throttledScroll = useThrottle(() => {
      if (window.scrollY === 0) dispatch(maximizeHeader());
      else if(Math.abs(prevScrollY.current - window.scrollY) > minScrollingDelta) dispatch(minimizeHeader());
      prevScrollY.current = window.scrollY;
    }, 300);

  const handleScroll = () => {
    if(window.scrollY === 0) dispatch(unlockHeader());
    if (canHandleScroll) {
      throttledScroll();
    } else prevScrollY.current = window.scrollY;
  };  

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    const resizeObs = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--header-current-height",
        headerRef.current.clientHeight + "px"
      );
    });
    resizeObs.observe(headerRef?.current);

    return () => {
      resizeObs.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //ignore listening to scrolling for 0.5 seconds (the length of animation) after header size changed
  useEffect(() => {
    dispatch(lockHeader());
    clearTimeout(scrollBlockTimer.current);
    scrollBlockTimer.current = setTimeout(
      () => dispatch(unlockHeader()),
      headerCollapseAnimationDuration
    );
    return () => clearTimeout(scrollBlockTimer.current);
  }, [isHeaderMinimized]);
}
