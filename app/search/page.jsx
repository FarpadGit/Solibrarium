"use client";

import { useRef } from "react";
import BookCard from "@/components/search/BookCard";
import BookCardSkeleton from "@/components/search/BookCardSkeleton";
import { lastItem } from "@/utils/ScrollAndOverlaps";
import { useSelector, useDispatch } from "react-redux";
import { selector as searchSelector } from "@/redux/features/search/searchSlice";
import { nextPage } from "@/redux/features/search/searchAsync";

export default function Search() {
  const { bookResults, searchString, isLoading, hasMore, wasError } =
    useSelector(searchSelector);
  const dispatch = useDispatch();

  //Ref for the element that triggers infinite scrolling
  const observer = useRef();
  const lastItemRef = lastItem(
    observer,
    isLoading,
    hasMore,
    () => {
      if (bookResults.length > 0) dispatch(nextPage());
    },
    [bookResults]
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center">
        {isLoading ? (
          "Egy pillanat, a majmok mindent megtesznek..."
        ) : bookResults.length > 0 ? (
          <>
            <span>Találatok a következőre: </span>
            <b>{searchString}</b>
          </>
        ) : (
          "Nincs találat"
        )}
      </div>
      <div className="flex min-h-screen min-w-full flex-col px-2 pt-4 md:px-12 lg:px-24">
        <div className="flex flex-col gap-2">
          {isLoading && bookResults.length === 0 && (
            <>
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
            </>
          )}
          {wasError && (
            <div className="text-center">
              Sajnos valamilyen hiba történt keresés közben
            </div>
          )}
          {bookResults?.map((book) => {
            if (book.placeholder) return <BookCardSkeleton key={book.id} />;
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
