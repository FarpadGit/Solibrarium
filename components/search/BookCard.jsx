﻿import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { getPlaceholderDataURL } from "@/utils/DataURL";
import { useSelector } from "react-redux";
import { selector as filtersSelector } from "@/redux/features/filters/filtersSlice";

export default function BookCard({ book }) {
  const { isFilterOn } = useSelector(filtersSelector);

  if (!book) return;
  if (isFilterOn && !book.price) return;
  return (
    <div className="card book_card animate-in fade-in slide-in-from-left-10 duration-1000">
      <div className="flex border-0 p-3 border-inherit shrink-0 items-center justify-items-center md:border-r-2">
        <Link href={`/details/${book.id}`}>
          <Image
            src={book.thumbnail || "/book_placeholder.png"}
            alt="book_cover"
            placeholder={getPlaceholderDataURL()}
            width={100}
            height={100}
            className="object-contain md:w-[200px] md:h-[200px]"
          />
        </Link>
      </div>
      <div className="p-5 grid grow relative">
        <div className="">
          <div className="lesser_text">ISBN: {book.ISBN10}</div>
          <div className="author_text line-clamp-2 md:line-clamp-none">
            {book.author}
          </div>
          <Link href={`/details/${book.id}`}>
            <div className="title_text">{book.title}</div>
          </Link>
          <div className="desc line-clamp-4 scroll_on_hover">
            {book.description || "Nincs elérhető leírás"}
          </div>
        </div>
        {book.price ? (
          <div className="grid justify-self-end self-end p-4">
            <div className="price justify-self-end">
              {CurrencyFormatter(book.price)}
            </div>
            <AddToCartButton book={book} />
          </div>
        ) : (
          <div className="justify-self-end self-end py-4 lesser_text">
            Sajnos ez a könyv nem elérhető ebben a régióban
          </div>
        )}
      </div>
    </div>
  );
}
