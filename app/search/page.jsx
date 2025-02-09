"use client";

import { useEffect, useRef } from "react";
import { useSearchContext } from "@/contexts/SearchContext";
import BookCard from "@/components/search/BookCard";
import BookCardSkeleton from "@/components/search/BookCardSkeleton";
import { lastItem } from "@/utils/ScrollAndOverlaps";

export default function Search() {
  const {
    SearchCriteria: { clearAllFields },
    SearchResults: {
      bookResults,
      searchString,
      isLoading,
      hasMore,
      resetPagination,
      nextPage,
    },
  } = useSearchContext();

  //Ref for the element that triggers infinite scrolling
  const observer = useRef();
  const lastItemRef = lastItem(
    observer,
    isLoading,
    hasMore,
    () => {
      nextPage();
    },
    [bookResults]
  );

  //when leaving the /Search page reset all search fields
  useEffect(() => {
    return () => {
      clearAllFields();
      resetPagination();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center">
        {isLoading
          ? "Egy pillanat, a majmok mindent megtesznek..."
          : bookResults.length > 0
          ? `Találatok a következőre: <${searchString}>`
          : "Nincs találat"}
      </div>
      <div className="flex min-h-screen min-w-full flex-col px-2 pt-4 md:px-12 lg:px-24">
        <div className="flex flex-col gap-2">
          {bookResults?.map((book) => {
            if (book.error)
              return (
                <div key="error" className="text-center">
                  Sajnos valamilyen hiba történt keresés közben
                </div>
              );
            else if (book.placeholder)
              return <BookCardSkeleton key={book.id} />;
            else return <BookCard book={book} key={book.id} />;
          })}
          <div className="self-center py-2" ref={lastItemRef}>
            {isLoading && "Találatok betöltése..."}
            {!hasMore && "Úgy látszik elérted a lista végét"}
          </div>
        </div>
      </div>
    </div>
  );
}
