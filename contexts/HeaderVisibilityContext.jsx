"use client";

import { useState, useContext, createContext } from "react";

const headerVisibilityContext = createContext();
export const useHeaderVisibilityContext = () =>
  useContext(headerVisibilityContext);

export default ({ children }) => {
  const [isHeaderFull, setIsHeaderFull] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(true);
  const canHeaderExpand = () => !isHeaderFull;
  const lockHeader = () => setIsHeaderFull(true);
  const unlockHeader = () => setIsHeaderFull(false);
  const isHeaderMinimized = () => !isFullyVisible;
  const minimizeHeader = () => setIsFullyVisible(false);
  const maximizeHeader = () => setIsFullyVisible(true);
  const toggleHeader = () => setIsFullyVisible((prev) => !prev);

  const NavVisibility = {
    canHeaderExpand,
    lockHeader,
    unlockHeader,
    isHeaderMinimized,
    minimizeHeader,
    maximizeHeader,
    toggleHeader,
  };

  return (
    <headerVisibilityContext.Provider value={NavVisibility}>
      {children}
    </headerVisibilityContext.Provider>
  );
};
