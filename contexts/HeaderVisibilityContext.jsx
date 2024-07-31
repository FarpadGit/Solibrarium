"use client";

import { useState, useContext, createContext, useRef } from "react";

const headerVisibilityContext = createContext();
export const useHeaderVisibilityContext = () =>
  useContext(headerVisibilityContext);

export default ({ children }) => {
  const [isHeaderFull, setIsHeaderFull] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(true);
  const canHandleScroll = useRef(true);
  const capSearchbars = () => setIsHeaderFull(true);
  const uncapSearchbars = () => setIsHeaderFull(false);
  const lockHeader = () => {
    canHandleScroll.current = false;
  };
  const unlockHeader = () => {
    canHandleScroll.current = true;
  };
  const minimizeHeader = () => setIsFullyVisible(false);
  const maximizeHeader = () => setIsFullyVisible(true);
  const toggleHeader = () => setIsFullyVisible((prev) => !prev);

  const NavVisibility = {
    canHeaderExpand: !isHeaderFull,
    capSearchbars,
    uncapSearchbars,
    isHeaderMinimized: !isFullyVisible,
    minimizeHeader,
    maximizeHeader,
    toggleHeader,
    canHandleScroll,
    lockHeader,
    unlockHeader,
  };

  return (
    <headerVisibilityContext.Provider value={NavVisibility}>
      {children}
    </headerVisibilityContext.Provider>
  );
};
