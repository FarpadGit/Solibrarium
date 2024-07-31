"use client";

import { useEffect, useRef } from "react";
import { useHeaderVisibilityContext } from "@/contexts/HeaderVisibilityContext";
import { useThrottle } from "@/hooks/ThrottleDebounce";

//hook for resizing the header appropriately when the user scrolls
export function useScrollHandler(headerRef) {
  const { isHeaderMinimized, minimizeHeader, maximizeHeader } =
    useHeaderVisibilityContext();
  const prevScrollY = useRef(0);
  const scrollBlockTimer = useRef(0);
  const { canHandleScroll, lockHeader, unlockHeader } = useHeaderVisibilityContext();

  const handleScroll = () => {
    if(window.scrollY === 0) unlockHeader();
    if (!canHandleScroll.current) return;
    const throttledScroll = useThrottle(() => {
      if (window.scrollY === 0) maximizeHeader();
      else if(Math.abs(prevScrollY.current - window.scrollY) > 3) minimizeHeader();
    }, 300);
    throttledScroll();
    prevScrollY.current = window.scrollY;
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
    lockHeader();
    clearTimeout(scrollBlockTimer.current);
    scrollBlockTimer.current = setTimeout(
      () => unlockHeader(),
      500
    );
    return () => clearTimeout(scrollBlockTimer.current);
  }, [isHeaderMinimized]);
}
