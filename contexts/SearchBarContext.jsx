"use client";

import { useState, useContext, createContext } from "react";
import { SearchENUM } from "@/utils/SearchENUM";

const searchbarContext = createContext();
export const useSearchBarContext = () => useContext(searchbarContext);

export default ({ children }) => {
  const [searchBarStack, setSearchBarStack] = useState([
    { id: 0, type: SearchENUM.title },
  ]);
  const searchBarArray = [...searchBarStack];
  const addSearchBar = (searchbar) =>
    setSearchBarStack((prev) => [...prev, searchbar]);
  const removeSearchBar = (searchbarId) =>
    setSearchBarStack((prev) => prev.filter((b) => b.id !== searchbarId));
  const currentSearchBarCount = searchBarStack.length;
  const hasSearchBarWithType = (type) =>
    searchBarStack.map((s) => s.type).includes(type);
  const replaceSearchBarType = (id, newtype) => {
    const newSearchBarStack = searchBarStack.map((e) =>
      e.id === id ? { id: e.id, type: newtype } : e
    );
    setSearchBarStack(newSearchBarStack);
  };
  const Searchbars = {
    searchBarArray,
    addSearchBar,
    removeSearchBar,
    currentSearchBarCount,
    hasSearchBarWithType,
    replaceSearchBarType,
  };

  return (
    <searchbarContext.Provider value={Searchbars}>
      {children}
    </searchbarContext.Provider>
  );
};
