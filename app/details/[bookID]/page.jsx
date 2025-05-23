﻿import Image from "next/image";
import { notFound } from "next/navigation";
import { getBookInfo } from "./bookInfo";
import CategoryLinks from "@/components/details/CategoryLinks";
import AddToCartButton from "@/components/ui/AddToCartButton";
import StarRating from "@/components/ui/StarRating";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import CurvedWindow from "@/components/details/CurvedWindow";
import { getPlaceholderDataURL } from "@/utils/DataURL";

export default async function Details({ params }) {
  const bookDetails = await getBookInfo((await params).bookID);

  if (!bookDetails.id) notFound();
  return (
    <div className="flex gap-5 w-full mb-[3.6rem] flex-wrap md:flex-nowrap">
      {/* left */}
      <div className="flex flex-col w-full h-[450px] justify-end items-center md:min-w-[300px] md:w-[unset] md:h-[480px]">
        <div className="cover_image_box">
          <div className="flex justify-center relative h-[80%]">
            <Image
              src={bookDetails.image || "/book_placeholder.png"}
              placeholder={getPlaceholderDataURL()}
              alt="book cover"
              width={180}
              height={300}
              className="object-contain absolute translate-y-[-6%] drop-shadow-[0_0_10px_var(--glow-color)] z-[2] sm:w-[215px] sm:h-[355px] md:translate-y-[-14%]"
            />
          </div>
          <div className="star_rating_box">
            <StarRating rating={bookDetails.rating} size={30} />
            <div className="text-xs">
              ({bookDetails.ratingsCount ?? 0} értékelés)
            </div>
          </div>
        </div>
      </div>

      {/* center */}
      <div className="w-1/2 flex-auto grid grid-cols-1 pl-3">
        <div className="">
          <h1 className="text-3xl">{bookDetails.title}</h1>
          {bookDetails.subtitle && (
            <h3 className="text-lg py-0.5">{bookDetails.subtitle}</h3>
          )}
          <h2 className="text-sm py-0.5">{bookDetails.author}</h2>
          <div className="text-xs pt-0.5 pb-7">
            {[bookDetails.publisher, bookDetails.publishedDate].join(", ")}
          </div>
          {bookDetails.categories && (
            <div className="text-xs my-0.5">
              Kategóriák: <CategoryLinks categories={bookDetails.categories} />
            </div>
          )}
          <div
            className="mt-2 text-sm text-justify"
            dangerouslySetInnerHTML={{
              __html: bookDetails.description || "<p>Nincs elérhető leírás</p>",
            }}
          ></div>
        </div>
        <div className="flex flex-col gap-1 mt-10 self-end">
          <div className="flex gap-1">
            {bookDetails.pageCount && (
              <p className="text-xs">{bookDetails.pageCount} oldal</p>
            )}
            {bookDetails.dimensions && (
              <p className="text-xs">
                {readDimensions(bookDetails.dimensions)}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {bookDetails.ISBN10 && (
              <p className="text-xs">ISBN10: {bookDetails.ISBN10}</p>
            )}
            {bookDetails.ISBN13 && (
              <p className="text-xs">ISBN13: {bookDetails.ISBN13}</p>
            )}
          </div>
        </div>
      </div>

      {/* right */}
      <div className="right_column">
        <div className="flex flex-col items-center mt-2 lg:mt-0">
          <div className="price_text">Online ár:</div>
          <div className="text-xl font-bold py-3">
            {CurrencyFormatter(bookDetails.price) ?? "N/A"}
          </div>
          <div className="py-3">
            <AddToCartButton book={bookDetails} />
          </div>
        </div>
        <div className="hidden md:block">
          <CurvedWindow />
        </div>
      </div>
    </div>
  );
}

function readDimensions(dimensions) {
  return Object.keys(dimensions).map(
    (key) => ` \u2022 ${translateDimension(key)}: ${dimensions[key]}`
  );
  function translateDimension(val) {
    switch (val) {
      case "height":
        return "magasság";
      case "width":
        return "szélesség";
      case "thickness":
        return "vastagság";
      default:
        return "";
    }
  }
}
