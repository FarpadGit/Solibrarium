"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSearchContext } from "@/contexts/SearchContext";
import { useHeaderVisibilityContext } from "@/contexts/HeaderVisibilityContext";
import { useSearchBarContext } from "@/contexts/SearchBarContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { SearchENUM, SearchType } from "@/utils/SearchENUM";
import { useDebounce } from "@/hooks/ThrottleDebounce";
import { useIsPresent, motion, AnimatePresence } from "framer-motion";
const SettingsModal = dynamic(
  () =>
    import("@/components/popovers/SettingsModal").then((res) => res.default),
  { ssr: false }
);

export default function SearchBar({ id, type: initialType, click }) {
  const [type, setType] = useState(initialType);
  const [searchText, setSearchText] = useState("");
  useDebounce(() => searchText !== "" && sendSearch(searchText), 600, [
    searchText,
  ]);
  const {
    SearchCriteria: {
      setTitleSearch,
      setAuthorSearch,
      setPublisherSearch,
      setSubjectSearch,
      setExcludingSearch,
      setISBNSearch,
      shouldClearSearch,
    },
    SearchResults: { isLoading, resetPagination },
  } = useSearchContext();
  const { canHeaderExpand, isHeaderMinimized, toggleHeader } =
    useHeaderVisibilityContext();
  const { replaceSearchBarType } = useSearchBarContext();

  const Setters = {
    [SearchENUM.title]: setTitleSearch,
    [SearchENUM.author]: setAuthorSearch,
    [SearchENUM.publisher]: setPublisherSearch,
    [SearchENUM.subject]: setSubjectSearch,
    [SearchENUM.isbn]: setISBNSearch,
    [SearchENUM.excluding]: setExcludingSearch,
  };

  const router = useRouter();
  const pathName = usePathname();
  const isPresent = useIsPresent();

  useEffect(() => {
    if (!isPresent && searchText !== "") clearSearch();
  }, [isPresent]);

  useEffect(() => {
    setSearchText("");
  }, [shouldClearSearch]);

  function clearSearch() {
    setSearchText("");
    sendSearch("");
  }

  function SetType(newType) {
    Setters[type]("");
    setType(newType);
    replaceSearchBarType(id, newType);
    if (searchText !== "") sendSearch(searchText, newType);
  }

  async function sendSearch(val, _type = type) {
    if (pathName !== "/search") router.push("/search");
    else window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    resetPagination();
    const safeSearchValue = val.replace(/\s/g, "+");
    Setters[_type](safeSearchValue);
  }

  function handleClick() {
    click(id);
  }

  function handleRightClick(e) {
    e.preventDefault();
    toggleHeader();
  }

  return (
    <motion.div
      initial={
        id === 0 ? false : { x: "-300%", opacity: 1, height: 0, marginTop: 0 }
      }
      animate={{
        x: 0,
        opacity: 1,
        height: "auto",
        marginTop: ["2em", "0em"],
        transition: {
          type: "spring",
          duration: 0.5,
          marginTop: { type: "spring", damping: 15 },
        },
      }}
      exit={{
        x: "-200%",
        opacity: 0,
        height: 0,
        transition: { type: "tween", duration: 0.3 },
      }}
      className="flex gap-2 h-30px md:h-auto"
    >
      <div className="flex border rounded-3xl overflow-hidden mb-2 drop-shadow-star">
        <div className="relative flex">
          {/* Type icon */}
          <span className="absolute left-1 self-center">
            <Image
              src={SearchType[type].Icon}
              alt="search icon"
              width={15}
              height={15}
              className="object-contain"
            />
          </span>

          {/* Text input */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={SearchType[type].Text}
            className="pl-6 outline-none focus:outline-none w-[min(33vw,216px)]"
          />

          {/* Search clearing X & loading spinner*/}
          <span
            className={`absolute right-2 self-center cursor-pointer ${
              searchText === "" ? "invisible" : ""
            }`}
            onClick={clearSearch}
          >
            {isLoading ? (
              <img src="/icons/spinner.gif" width={20} height={20} alt="" />
            ) : (
              "\u2717"
            )}
          </span>
        </div>

        {/* Settings button */}
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="searchbar_btn_base settings_btn">
              <Image
                src="/icons/settings.svg"
                alt="search option"
                width={15}
                height={15}
                className="object-contain md:w-[20px] md:h-[20px]"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <AnimatePresence>
              <SettingsModal
                key={`settings_popover_${id}`}
                settingSetter={SetType}
                initialType={type}
              />
            </AnimatePresence>
          </PopoverContent>
        </Popover>
      </div>

      {/* Add/Remove buttons */}
      {id === 0 ? (
        <div className="flex items-start drop-shadow-star">
          <button
            type="button"
            className={`searchbar_btn_base ${
              canHeaderExpand() ? "add_btn" : "green_btn"
            }`}
            onClick={handleClick}
            onContextMenu={handleRightClick}
          >
            <Image
              src="/icons/add.svg"
              alt="add searchbar"
              width={22}
              height={22}
              className={`object-contain md:w-[44px] md:h-[44px] ${
                !canHeaderExpand() ? "absolute opacity-0" : ""
              }`}
            />

            <Image
              src="/icons/arrow-collapse.svg"
              alt="collapse"
              width={20}
              height={20}
              className={`object-contain transition-transform p-1 md:p-0 ${
                canHeaderExpand() ? "absolute opacity-0" : ""
              } ${!isHeaderMinimized() ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      ) : (
        <div className={id === 0 ? "hidden" : "drop-shadow-star mb-2"}>
          <button className="searchbar_btn_base red_btn" onClick={handleClick}>
            <Image
              src="/icons/remove.svg"
              alt="remove"
              width={20}
              height={20}
              className="object-contain"
            />
          </button>
        </div>
      )}
    </motion.div>
  );
}
