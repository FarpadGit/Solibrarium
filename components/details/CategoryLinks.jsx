"use client";

import Link from "next/link";
import { useSearchContext } from "@/contexts/SearchContext";
import { SearchENUM } from "@/utils/SearchENUM";

export default function CategoryLinks({ categories }) {
  const {
    SearchCriteria: { setSubjectSearch, setTransientSearch },
  } = useSearchContext();
  function searchCategory(value) {
    setSubjectSearch(value);
    setTransientSearch({ [SearchENUM.subject]: true });
  }
  return (
    <>
      {categories.map((category) => (
        <p key={category}>
          <Link
            href="/search"
            onClick={() => searchCategory(category)}
            className="hover:underline"
          >
            {category}
          </Link>
        </p>
      ))}
    </>
  );
}
