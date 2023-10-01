import Image from "next/image";
import { notFound } from "next/navigation";
import { getBookInfo } from "./bookInfo";
import CategoryLinks from "@/components/details/CategoryLinks";
import AddToCartButton from "@/components/ui/AddToCartButton";
import StarRating from "@/components/ui/StarRating";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import CurvedWindow from "@/components/details/CurvedWindow";

export default async function Details({ params }) {
  const bookDetails = await getBookInfo(params.bookID);

  if (!bookDetails.id) notFound();
  return (
    <div className="flex gap-5 w-full mb-[3.6rem] flex-wrap md:flex-nowrap">
      {/* left */}
      <div className="flex flex-col w-full h-[450px] justify-end md:min-w-[300px] md:w-[unset] md:h-[480px]">
        <div className="cover_image_box">
          <div className="flex justify-center relative h-[80%]">
            <Image
              src={bookDetails.image || "/book_placeholder.png"}
              placeholder="blur"
              blurDataURL="/book_loading.jpg"
              alt="book cover"
              width={215}
              height={355}
              className="object-contain absolute translate-y-[-14%] drop-shadow-[0_0_10px_var(--glow-color)] z-[2]"
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
          <div className="text-3xl">{bookDetails.title}</div>
          {bookDetails.subtitle && (
            <div className="text-lg py-0.5">{bookDetails.subtitle}</div>
          )}
          <div className="text-sm py-0.5">{bookDetails.author}</div>
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
