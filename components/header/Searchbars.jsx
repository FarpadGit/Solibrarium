import { useRef } from "react";
import FilterButton from "@/components/header/FilterButton";
import SearchBar from "@/components/header/SearchBar";
import { SearchENUM } from "@/utils/SearchENUM";
import { AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  selector as headerVisibilitySelector,
  reducers as headerVisibilityReducers,
} from "@/redux/features/headerVisibility/headerVisibilitySlice";
import {
  selector as searchbarsSelector,
  reducers as searchbarsReducers,
} from "@/redux/features/searchbars/searchbarsSlice";

export default function Searchbars() {
  const { isHeaderMinimized } = useSelector(headerVisibilitySelector);
  const { currentSearchBarCount, searchBarArray, hasSearchBarWithType } =
    useSelector(searchbarsSelector);
  const dispatch = useDispatch();
  const { capSearchbars, uncapSearchbars, maximizeHeader, toggleHeader } =
    headerVisibilityReducers;
  const { addSearchBar, removeSearchBar } = searchbarsReducers;

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
      dispatch(toggleHeader());
      return;
    }

    dispatch(maximizeHeader());
    if (currentSearchBarCount >= 3) dispatch(capSearchbars());

    const newSearchbarType = defaultSearchBarOrder.find(
      (searchbarType) => !hasSearchBarWithType(searchbarType)
    );

    const newSearchbar = { id: searchBarId.current, type: newSearchbarType };
    dispatch(addSearchBar(newSearchbar));
    searchBarId.current++;
  }

  function removeBar(barId) {
    dispatch(removeSearchBar(barId));
    dispatch(uncapSearchbars());
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
