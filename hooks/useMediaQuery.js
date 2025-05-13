"use client";

import { useEffect, useState } from "react";

export const ScreenENUM = {
  "2XL": 1536,
  XL: 1280,
  LG: 1024,
  MD: 768,
  SM: 640,
  XS: 0,
};

//hook for reading screen width like css or tailwind media queries but for components with width/height props
// ** usecase **
// const screenWidth = useMediaQuery(); if(screenWidth > ScreenENUM.MD) ....

export default function useMediaQuery() {
  const [screenSize, setScreenSize] = useState({});
  function checkScreenSize() {
    const screenWidth2XL = window.matchMedia(`(min-width: ${ScreenENUM["2XL"]}px)`).matches;
    const screenWidthXL = window.matchMedia(`(min-width: ${ScreenENUM["XL"]}px)`).matches;
    const screenWidthLG = window.matchMedia(`(min-width: ${ScreenENUM["LG"]}px)`).matches;
    const screenWidthMD = window.matchMedia(`(min-width: ${ScreenENUM["MD"]}px)`).matches;
    const screenWidthSM = window.matchMedia(`(min-width: ${ScreenENUM["SM"]}px)`).matches;
    if (screenWidth2XL) setScreenSize(ScreenENUM["2XL"]);
    else if (screenWidthXL) setScreenSize(ScreenENUM["XL"]);
    else if (screenWidthLG) setScreenSize(ScreenENUM["LG"]);
    else if (screenWidthMD) setScreenSize(ScreenENUM["MD"]);
    else if (screenWidthSM) setScreenSize(ScreenENUM["SM"]);
    else setScreenSize(ScreenENUM["XS"]);
  }
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize;
}
