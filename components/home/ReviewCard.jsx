import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import StarRating from "@/components/ui/StarRating";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { getPlaceholderDataURL } from "@/utils/DataURL";

export default function ReviewCard({ book, reviewText, rating }) {
  if (!book) return;

  return (
    <div className="review_card">
      <div className="grid grid-rows-[0.8fr_1.2fr_60px] grid-cols-1 md:grid-rows-[265px_70px] md:grid-cols-2 items-start justify-center w-full">
        <div className="relative mr-2">
          <Link href={`/details/${book.id}`}>
            <Image
              src={book.image || "/book_placeholder.png"}
              alt="book_cover"
              placeholder={getPlaceholderDataURL()}
              width={170}
              height={260}
              className="absolute object-contain w-[127px] h-[195px] md:w-[170px] md:h-[260px] left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 -top-[3rem] drop-shadow-lg"
            />
          </Link>
        </div>
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href={`/details/${book.id}`}>
            <div className="font-bold text-sm line-clamp-2 hover:underline">
              {book.title}
            </div>
          </Link>
          <div className="text-sm line-clamp-2">{book.author}</div>
          <div>
            <StarRating rating={rating} />
          </div>
          <div className="text-xs pt-1 h-[5.1rem] line-clamp-[5] scroll_on_hover">
            {reviewText === "" ? "(nincs leírás)" : `"${reviewText}"`}
          </div>
          <div className="text-xs pt-1">Online Ár:</div>
          {book.price ? (
            <div className="font-bold text-base py-2">
              {CurrencyFormatter(book.price)}
            </div>
          ) : (
            <div className="text-sm py-2">N/A</div>
          )}
        </div>
        <div className="buttons md:col-span-2 md:col-start-2 py-2 justify-self-center">
          <AddToCartButton book={book.price ? book : null} />
        </div>
      </div>
    </div>
  );
}
