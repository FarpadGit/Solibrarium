"use client";

import { useEffect, useRef, useState } from "react";

//on initial prefetch both server and client has to have the same values to build the same html, which means no touchy the localstorage.
//then the client runs the (client exclusive) useEffects when the server is done and not looking.
export function useLocalStorage(key, initialValue) {
  const isInitialized = useRef(false);

  const getAppropriateValue = () => {
    //if in first fetch phase skip this part
    if (isInitialized.current) {
      //first if the key already exists in localstorage get that
      const jsonValue = localStorage.getItem(key);
      if (jsonValue != null && jsonValue != undefined)
        return JSON.parse(jsonValue);
    }
    //if initialValue is a function we want to call it and store the return value
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  };

  const [value, setValue] = useState(getAppropriateValue);

  //useEffects are client side only, which means now we can read from Local Storage
  useEffect(() => {
    if(!isInitialized.current){
      isInitialized.current = true;
      setValue(getAppropriateValue);
      return;
    }
    
    const invalid = !key || value == null || value == undefined;
    if (!invalid) localStorage.setItem(key, JSON.stringify(value));
    if (value === undefined && key) localStorage.removeItem(key);
  }, [value]);

  return [value, setValue];
}
