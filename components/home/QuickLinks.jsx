"use client";

import Link from "next/link";
import { SearchENUM } from "@/utils/SearchENUM";
import { useDispatch } from "react-redux";
import { reducers as searchReducers } from "@/redux/features/search/searchSlice";
import { executeSearch } from "@/redux/features/search/searchAsync";

export default function QuickLinks() {
  return (
    <div className="w-full flex justify-between overflow-x-auto gap-4 mb-4 md:mb-10">
      <QuickLink target="Audiobook">Hangoskönyvek</QuickLink>
      <QuickLink target="Juvenile Fiction">Gyerekek</QuickLink>
      <QuickLink target="Young Adult Fiction">Fiatal Felnőtt</QuickLink>
      <QuickLink target="Fantasy">Fantasy</QuickLink>
      <QuickLink target="History">Történelem</QuickLink>
      <QuickLink target="Comics & Graphic Novels">Képregények</QuickLink>
      <QuickLink target="Fiction/Romance/General">Romantika</QuickLink>
      <QuickLink target="Horror">Horror</QuickLink>
    </div>
  );
}

function QuickLink({ children, target }) {
  const dispatch = useDispatch();
  const { setSearchValue, setTransientSearch } = searchReducers;

  function searchSubject(value) {
    dispatch(setSearchValue({ type: SearchENUM.subject, newValue: value }));
    dispatch(setTransientSearch({ [SearchENUM.subject]: true }));
    dispatch(executeSearch());
  }
  return (
    <Link
      href="/search"
      onClick={() => searchSubject(target)}
      className="border-b-2 border-b-transparent hover:border-b-green focus-visible:border-b-green focus-visible:outline-none hover:cursor-pointer whitespace-nowrap text-sm md:text-base"
    >
      {children}
    </Link>
  );
}
