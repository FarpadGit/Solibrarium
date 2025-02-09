"use client";

import Link from "next/link";
import { useSearchContext } from "@/contexts/SearchContext";
import { SearchENUM } from "@/utils/SearchENUM";

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
  const {
    SearchCriteria: { setSubjectSearch, setTransientSearch },
  } = useSearchContext();
  function searchCategory(value) {
    setSubjectSearch(value);
    setTransientSearch({ [SearchENUM.subject]: true });
  }
  return (
    <Link
      href="/search"
      onClick={() => searchCategory(target)}
      className="border-b-2 border-b-transparent hover:border-b-green focus-visible:border-b-green focus-visible:outline-none hover:cursor-pointer whitespace-nowrap text-sm md:text-base"
    >
      {children}
    </Link>
  );
}
