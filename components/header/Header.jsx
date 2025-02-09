"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { useHeaderVisibilityContext } from "@/contexts/HeaderVisibilityContext";
import { useSearchBarContext } from "@/contexts/SearchBarContext";
import HeaderBackground from "@/components/header/HeaderBackground";
import HeaderButtons from "@/components/header/HeaderButtons";
import SearchBar from "@/components/ui/SearchBar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { SearchENUM } from "@/utils/SearchENUM";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const TECollapse = dynamic(
  () => import("tw-elements-react").then((res) => res.TECollapse),
  { ssr: false }
);
const FiltersModal = dynamic(
  () => import("@/components/popovers/FiltersModal").then((res) => res.default),
  { ssr: false }
);

export default function Header() {
  const { darkMode, toggleCollapsedButtons, areButtonsCollapsed } =
    useAppContext();
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

  const [searchBarId, setSearchBarId] = useState(1);
  const defaultSearchBarOrder = [
    SearchENUM.title,
    SearchENUM.author,
    SearchENUM.publisher,
    SearchENUM.subject,
    SearchENUM.isbn,
    SearchENUM.excluding,
  ];

  const headerRef = useRef(null);
  useScrollHandler(headerRef);

  function addBar() {
    if (currentSearchBarCount >= 4) {
      toggleHeader();
      return;
    }
    maximizeHeader();
    if (currentSearchBarCount >= 3) capSearchbars();

    const type = defaultSearchBarOrder.find((e) => !hasSearchBarWithType(e));
    const bar = { id: searchBarId, type: type };
    addSearchBar(bar);
    setSearchBarId((prev) => prev + 1);
  }

  function removeBar(barId) {
    removeSearchBar(barId);
    uncapSearchbars();
  }

  return (
    <nav
      ref={headerRef}
      className={`header ${
        !isHeaderMinimized ? "header_full" : "header_short"
      }`}
    >
      {/* Header Background Images */}
      <HeaderBackground />

      <div className="relative flex justify-between grow">
        {/* Logo */}
        <Link
          href="/"
          className="relative w-2/12 h-full flex gap-2 transition-transform hover:scale-[1.05]"
        >
          <div className="relative md:absolute top-0 left-0 w-full h-full">
            <Image
              src={
                !darkMode
                  ? "/solibrarium_logo.png"
                  : "/solibrarium_logo_night.png"
              }
              alt="logo"
              fill
              className={`object-contain transition-[object_position_0.5s_ease] ${
                currentSearchBarCount === 1 || isHeaderMinimized
                  ? "object-[50%] lg:object-[0%]"
                  : "object-[50%]"
              }`}
            />
            <p
              className="logo_text drop-shadow-star"
              data-indented={
                currentSearchBarCount === 1 || isHeaderMinimized
                  ? ""
                  : undefined
              }
            >
              Solibrarium
            </p>
            {/* webkit fallback */}
            <div className="logo_img"></div>
          </div>
        </Link>

        {/* Searchbars */}
        <div
          className={`flex flex-col-reverse items-end gap-0 pr-2 md:-mt-2 md:gap-1 ${
            isHeaderMinimized ? "overflow-hidden" : ""
          }`}
        >
          <AnimatePresence>
            {searchBarArray.map((i) => {
              if (i.id === 0)
                return (
                  <div
                    className="relative flex gap-0 md:gap-2"
                    key={"Filter" + i.id}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="filters_btn header_icon_btn"
                        >
                          <Image
                            src="/icons/filter.svg"
                            alt="Filter"
                            width={20}
                            height={20}
                            className="md:w-[30px] md:h-[30px]"
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="center" side="left">
                        <AnimatePresence>
                          <FiltersModal />
                        </AnimatePresence>
                      </PopoverContent>
                    </Popover>
                    <SearchBar
                      key={"Searchbar" + i.id}
                      id={0}
                      type={SearchENUM.title}
                      click={addBar}
                    />
                  </div>
                );
              else
                return (
                  <SearchBar
                    key={"SearchBar" + i.id}
                    id={i.id}
                    type={i.type}
                    click={removeBar}
                  />
                );
            })}
          </AnimatePresence>
        </div>

        {/* Right side buttons - Desktop Navigation */}
        <div className="hidden md:block">
          <HeaderButtons />
        </div>

        {/* Right side buttons - Mobile Navigation */}
        <div className="block w-1/5 md:hidden">
          <div className={"flex justify-center"}>
            <button
              onClick={() => {
                maximizeHeader();
                toggleCollapsedButtons();
              }}
              className="misc_btn drop-shadow-star min-w-[50px]"
            >
              {"\u25bc"}
            </button>
          </div>
          <div className="flex justify-center">
            <TECollapse
              className="fixed flex justify-center border border-black overflow-hidden"
              show={areButtonsCollapsed}
            >
              <div className="rounded-2xl z-50">
                <HeaderBackground
                  withOverhang={false}
                  verticalOffset="-5"
                  className="scale-[200%]"
                />
                <div className="px-2 py-4">
                  <HeaderButtons />
                </div>
              </div>
            </TECollapse>
          </div>
        </div>
      </div>
    </nav>
  );
}
