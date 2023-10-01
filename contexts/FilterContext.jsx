"use client";

import { useState, useContext, createContext } from "react";
import { usePathname } from "next/navigation";

const filterContext = createContext();
export const useFilterContext = () => useContext(filterContext);

export default ({ children }) => {
  const pathName = usePathname();
  const [isAvailableResultsOnly, setIsAvailableResultsOnly] = useState(false);
  const setFilter = (l) => {
    if (pathName === "/search") window.scrollTo({ top: 0, left: 0 });
    setIsAvailableResultsOnly(l);
  };
  const FilterOptions = {
    Price: {
      isFilterOn: isAvailableResultsOnly,
      setFilter,
    },
  };

  return (
    <filterContext.Provider value={FilterOptions}>
      {children}
    </filterContext.Provider>
  );
};
