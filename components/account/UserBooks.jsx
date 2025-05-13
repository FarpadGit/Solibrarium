"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useMediaQuery, { ScreenENUM } from "@/hooks/useMediaQuery";
import { send } from "@/utils/FetchRequest";
import { getPlaceholderDataURL } from "@/utils/DataURL";
import { BookCover } from "book-cover-3d";
import { useSession } from "next-auth/react";

const UserBooks = React.forwardRef(({ selected, setSelected }, ref) => {
  const [userBooks, setUserBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenSize = useMediaQuery();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      send(`/api/users/${session.user.id}/collection`).then((body) => {
        if (!body.error) setUserBooks(body);
        setIsLoading(false);
      });
    } else setUserBooks([]);
  }, []);

  function getUserBookStyles(index) {
    const left = ["left-[5%]", "left-[28%]", "right-[28%]", "right-[5%]"];
    const top = [
      "top-[3%] xl:top-[4%]",
      "top-[33%] xl:top-[34%]",
      "top-[63%] xl:top-[64%]",
    ];
    return `${top[BigInt(index) / 4n]} ${left[index % 4]}`;
  }

  const userBookSize = {
    width:
      screenSize >= ScreenENUM.XL ? 100 : screenSize >= ScreenENUM.SM ? 75 : 60,
    height:
      screenSize >= ScreenENUM.XL
        ? 150
        : screenSize >= ScreenENUM.SM
        ? 112
        : 90,
  };

  //split user books into chunks of 12 -- one array for each shelf
  const userBooksByShelf = Array.from(
    { length: Math.ceil(userBooks.length / 12) },
    (book, index) => userBooks.slice(index * 12, 12 + index * 12)
  );

  return (
    <>
      {/* no books, empty bookshelf */}
      {userBooksByShelf.length === 0 ? (
        <div key={`bookshelf0`} className="relative">
          <p className="absolute top-[15%] left-1/2 -translate-x-1/2">
            {isLoading ? "Könyveid lekérdezése..." : "Könyvespolcod még üres"}
          </p>
          <Image
            src="/decor/bookshelf.png"
            alt=""
            width={550}
            height={532}
            className="object-cover max-w-3/4"
          />
        </div>
      ) : (
        // add one shelf for every batch of 12 books
        userBooksByShelf.map((shelf, shelfIndex) => (
          <div
            key={`bookshelf${shelfIndex}`}
            className={`relative${
              shelfIndex > 0 ? ` mt-[-50px] xl:mt-[-60px]` : ""
            }`}
            radioGroup="userBook"
          >
            <Image
              src="/decor/bookshelf.png"
              alt=""
              width={550}
              height={532}
              className="object-cover max-w-3/4"
            />
            {/* add the 12 books in the array to the bookshelf */}
            {shelf.map((book, bookIndex) => (
              <div
                key={bookIndex}
                tabIndex={-1}
                className={`userbook absolute ${getUserBookStyles(bookIndex)} ${
                  selected?.id === book.id ? "selected" : ""
                }`}
              >
                <input
                  className="userbook_input"
                  type="radio"
                  id={book.id}
                  name="userBook"
                  value={book.id}
                  tabIndex={-1}
                  checked={selected?.id === book.id}
                  aria-checked={selected?.id === book.id}
                  onChange={(e) => {
                    if (e.target.checked) setSelected(book);
                  }}
                />
                <label
                  ref={selected?.id === book.id ? ref : undefined}
                  htmlFor={book.id}
                  tabIndex={0}
                  className="pointer-events-auto"
                  onKeyDown={(e) => {
                    if (e.code === "Enter") setSelected(book);
                  }}
                >
                  <BookCover
                    width={userBookSize.width}
                    height={userBookSize.height}
                    rotate={0}
                    rotateHover={20}
                    shadowColor={
                      selected?.id === book.id ? "white" : "transparent"
                    }
                  >
                    <Image
                      src={book.image}
                      alt={book.title}
                      placeholder={getPlaceholderDataURL()}
                      width={userBookSize.width}
                      height={userBookSize.height}
                      className="bookcover_image outline outline-1 outline-transparent"
                    />
                  </BookCover>
                </label>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
});
export default UserBooks;
