"use client";

import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", false);
  //on prefetch we go with light mode
  const [enabled, setEnabled] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    //if no manual dark mode -> browser preference
    setEnabled(darkMode || prefersDarkMode);
  }, []);

  useEffect(() => {
    //if user changed themes or read from localstorage -> update "enabled" except on first (server side) run
    if (isInitialized.current) setEnabled(darkMode);
  }, [darkMode]);

  useEffect(() => {
    //if dark preference from browser -> write it to localstorage
    if (enabled) setDarkMode(true);
    document.documentElement.classList.toggle("dark-mode", enabled);
    isInitialized.current = true;
  }, [enabled]);

  return [enabled, setDarkMode];
}
