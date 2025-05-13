"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useDebounce } from "@/hooks/ThrottleDebounce";
import { SearchENUM, SearchType } from "@/utils/SearchENUM";
import { useIsPresent, motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  selector as searchSelector,
  reducers as searchReducers,
} from "@/redux/features/search/searchSlice";
import {
  selector as headerVisibilitySelector,
  reducers as headerVisibilityReducers,
} from "@/redux/features/headerVisibility/headerVisibilitySlice";
import { reducers as searchbarsReducers } from "@/redux/features/searchbars/searchbarsSlice";
import { executeSearch } from "@/redux/features/search/searchAsync";
import { abortSend } from "@/utils/FetchRequest";

const SettingsModal = dynamic(
  () =>
    import("@/components/popovers/SettingsModal").then((res) => res.default),
  { ssr: false }
);

const debounceDuration = 1000;

export default function SearchBar({ id, type: initialType, click }) {
  const [type, setType] = useState(initialType);
  const [searchText, setSearchText] = useState("");

  const {
    isLoading,
    inTitle,
    inAuthor,
    inPublisher,
    subject,
    excluding,
    isbn,
  } = useSelector(searchSelector);
  const { canHeaderExpand, isHeaderMinimized } = useSelector(
    headerVisibilitySelector
  );
  const dispatch = useDispatch();
  const { setSearchValue, resetPagination } = searchReducers;
  const { toggleHeader, lockHeader } = headerVisibilityReducers;
  const { replaceSearchBarType } = searchbarsReducers;

  const router = useRouter();
  const pathName = usePathname();
  const isPresent = useIsPresent();

  useDebounce(
    () => {
      if (pathName !== "/search" && searchText === "") return;
      sendSearch(type, searchText);
    },
    debounceDuration,
    [searchText]
  );

  useEffect(() => {
    if (!isPresent && searchText !== "") clearSearch();
  }, [isPresent]);

  useEffect(() => {
    switch (type) {
      case SearchENUM.title:
        if (inTitle !== searchText) setSearchText(inTitle);
        break;
      case SearchENUM.author:
        if (inAuthor !== searchText) setSearchText(inAuthor);
        break;
      case SearchENUM.publisher:
        if (inPublisher !== searchText) setSearchText(inPublisher);
        break;
      case SearchENUM.subject:
        if (subject !== searchText) setSearchText(subject);
        break;
      case SearchENUM.excluding:
        if (excluding !== searchText) setSearchText(excluding);
        break;
      case SearchENUM.isbn:
        if (isbn !== searchText) setSearchText(isbn);
        break;
      default:
        break;
    }
  }, [inTitle, inAuthor, inPublisher, subject, excluding, isbn]);

  function clearSearch() {
    setSearchText("");
    if (isLoading) abortSend();
  }

  function SetType(newType) {
    dispatch(setSearchValue({ type, newValue: "" }));
    setType(newType);
    dispatch(replaceSearchBarType({ id, newType }));
    if (searchText !== "") sendSearch(newType, searchText);
  }

  function sendSearch(type, value) {
    if (pathName !== "/search") router.push("/search");
    else if (window.scrollY !== 0) {
      // when scrolling to the top don't let the header minimize. The scroll handling hook will automatically unlock it when it gets to the top
      dispatch(lockHeader());
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    dispatch(resetPagination());
    dispatch(setSearchValue({ type, newValue: value }));
    dispatch(executeSearch({ isOnSearchPage: pathName === "/search" }));
  }

  function handleClick() {
    click(id);
  }

  function handleRightClick(e) {
    e.preventDefault();
    dispatch(toggleHeader());
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
      <div className="flex border border-star rounded-3xl overflow-hidden mb-2 drop-shadow-star">
        <div className="relative flex">
          {/* Type icon */}
          <span className="absolute left-1 self-center">
            <Image
              src={SearchType[type].Icon}
              alt={`icon for search ${SearchType[type].Alt}`}
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
            <button
              type="button"
              className="searchbar_btn_base settings_btn green_btn"
            >
              <Image
                src="/icons/settings.svg"
                alt="icon for search options"
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
            className="searchbar_btn_base add_btn green_btn"
            onClick={handleClick}
            onContextMenu={handleRightClick}
          >
            {canHeaderExpand ? (
              <Image
                src="/icons/plus.svg"
                alt="add searchbar"
                width={22}
                height={22}
                className="object-contain md:w-[44px] md:h-[44px]"
              />
            ) : (
              <Image
                src="/icons/arrow-collapse.svg"
                alt="collapse searchbars"
                width={20}
                height={20}
                className={`object-contain transition-transform md:w-[44px] md:h-[44px] ${
                  !isHeaderMinimized ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
        </div>
      ) : (
        <div className={id === 0 ? "hidden" : "drop-shadow-star mb-2"}>
          <button className="searchbar_btn_base red_btn" onClick={handleClick}>
            <Image
              src="/icons/remove.svg"
              alt="remove searchbar"
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
