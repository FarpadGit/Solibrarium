import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";
import StarRating from "@/components/ui/StarRating";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { getPlaceholderDataURL } from "@/utils/DataURL";

export default function MarqueeCard({ book }) {
  if (!book) return;

  return (
    <div className="marquee_card">
      <div className="marquee_content">
        <div className="relative grid items-start justify-center w-full">
          <Link href={`/details/${book.id}`}>
            <Image
              src={book.image || "/book_placeholder.png"}
              alt="book_cover"
              placeholder={getPlaceholderDataURL()}
              fill
              className="object-contain"
            />
          </Link>
        </div>
        <Link href={`/details/${book.id}`}>
          <div
            className="marquee_text font-bold text-sm pt-5 line-clamp-2 hover:underline"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {book.title}
          </div>
        </Link>
        <div className="marquee_text text-xs pt-2 line-clamp-2">
          {book.author}
        </div>
        <div className="flex text-xs">
          <StarRating rating={book.rating} />
          <p className="marquee_text">({book.ratingsCount ?? 0})</p>
        </div>
        <div className="marquee_text text-xs pt-1">Online Ár:</div>
        {book.price ? (
          <div className="marquee_text font-bold text-base py-2">
            {CurrencyFormatter(book.price)}
          </div>
        ) : (
          <div className="marquee_text text-sm py-2">N/A</div>
        )}
        <div className="buttons py-2">
          <AddToCartButton book={book.price ? book : null} />
        </div>
      </div>
    </div>
  );
}
