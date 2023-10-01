import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import StarRating from "@/components/ui/StarRating";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";

export default function ReviewCard({ book, reviewText, rating }) {
  if (!book) return;

  return (
    <div className="review_card">
      <div className="grid grid-rows-[265px_70px] grid-cols-2 items-start justify-center w-full">
        <div className="relative mr-2">
          <Image
            src={book.image || "/book_placeholder.png"}
            alt="book_cover"
            placeholder="blur"
            blurDataURL="/book_loading.jpg"
            width={170}
            height={260}
            className="absolute object-contain -top-[3rem] drop-shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Link href={`/details/${book.id}`}>
            <div className="font-bold text-sm line-clamp-2 hover:underline">
              {book.title}
            </div>
          </Link>
          <div className="text-sm line-clamp-2">{book.author}</div>
          <div>
            <StarRating rating={rating} />
          </div>
          <div className="text-xs pt-1 h-[5rem] line-clamp-[5] scroll_on_hover">
            "{reviewText}"
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
        <div></div>
        <div className="buttons py-2 justify-self-center">
          <AddToCartButton book={book.price ? book : null} />
        </div>
      </div>
    </div>
  );
}
