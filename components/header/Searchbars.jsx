import { useRef } from "react";
import { useHeaderVisibilityContext } from "@/contexts/HeaderVisibilityContext";
import { useSearchBarContext } from "@/contexts/SearchBarContext";
import FilterButton from "@/components/header/FilterButton";
import SearchBar from "@/components/ui/SearchBar";
import { SearchENUM } from "@/utils/SearchENUM";
import { AnimatePresence } from "framer-motion";

export default function Searchbars() {
  const {
    capSearchbars,
    uncapSearchbars,
    isHeaderMinimized,
    maximizeHeader,
    toggleHeader,
  } = useHeaderVisibilityContext();

  const {
    addSearchBar,
    removeSearchBar,
    currentSearchBarCount,
    searchBarArray,
    hasSearchBarWithType,
  } = useSearchBarContext();

  const searchBarId = useRef(1);
  const defaultSearchBarOrder = [
    SearchENUM.title,
    SearchENUM.author,
    SearchENUM.publisher,
    SearchENUM.subject,
    SearchENUM.isbn,
    SearchENUM.excluding,
  ];

  function addBar() {
    if (currentSearchBarCount >= 4) {
      toggleHeader();
      return;
    }

    maximizeHeader();
    if (currentSearchBarCount >= 3) capSearchbars();

    const newSearchbarType = defaultSearchBarOrder.find(
      (searchbarType) => !hasSearchBarWithType(searchbarType)
    );
    const newSearchbar = { id: searchBarId.current, type: newSearchbarType };
    addSearchBar(newSearchbar);
    searchBarId.current++;
  }

  function removeBar(barId) {
    removeSearchBar(barId);
    uncapSearchbars();
  }
  return (
    <div
      className={`flex flex-col-reverse items-end gap-0 pr-2 md:-mt-2 md:gap-1 ${
        isHeaderMinimized ? "overflow-hidden" : ""
      }`}
    >
      <AnimatePresence>
        {searchBarArray.map((searchbar) => {
          if (searchbar.id === 0)
            return (
              <div
                className="relative flex gap-0 md:gap-2"
                key="FirstSearchbar"
              >
                <FilterButton />
                <SearchBar
                  key={"Searchbar" + searchbar.id}
                  id={0}
                  type={SearchENUM.title}
                  click={addBar}
                />
              </div>
            );
          else
            return (
              <SearchBar
                key={"SearchBar" + searchbar.id}
                id={searchbar.id}
                type={searchbar.type}
                click={removeBar}
              />
            );
        })}
      </AnimatePresence>
    </div>
  );
}
