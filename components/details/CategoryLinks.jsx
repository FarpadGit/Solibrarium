"use client";

import Link from "next/link";
import { SearchENUM } from "@/utils/SearchENUM";
import { useDispatch } from "react-redux";
import { reducers as searchReducers } from "@/redux/features/search/searchSlice";
import { executeSearch } from "@/redux/features/search/searchAsync";

export default function CategoryLinks({ categories }) {
  const dispatch = useDispatch();
  const { setSearchValue, setTransientSearch } = searchReducers;

  function searchSubject(value) {
    dispatch(setSearchValue({ type: SearchENUM.subject, newValue: value }));
    dispatch(setTransientSearch({ [SearchENUM.subject]: true }));
    dispatch(executeSearch());
  }
  return (
    <>
      {categories.map((category) => (
        <p key={category}>
          <Link
            href="/search"
            onClick={() => searchSubject(category)}
            className="hover:underline"
          >
            {category}
          </Link>
        </p>
      ))}
    </>
  );
}
