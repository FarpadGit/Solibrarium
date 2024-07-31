import Image from "next/image";
import Link from "next/link";
import { useShoppingCartContext } from "@/contexts/ShoppingCartContext";
import { SheetClose } from "@/components/ui/Sheet";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { getPlaceholderDataURL } from "@/utils/DataURL";
import { motion } from "framer-motion";

export function CartItem({
  bookData,
  quantity,
  className,
  outsideCart = false,
}) {
  const { id, author, title, image, price } = bookData;
  const { removeFromCart } = useShoppingCartContext();

  return (
    <motion.div
      initial={false}
      exit={{
        x: "-100%",
        opacity: 0,
        height: 0,
        overflow: "hidden",
        padding: 0,
        transition: { type: "tween", duration: 0.3 },
      }}
      className={className}
    >
      <CloseWrapper wrap={!outsideCart}>
        <Link href={`/details/${id}`}>
          <div
            className={`text-left max-h-[144px] ${
              outsideCart ? "min-w-[50px]" : "min-w-[100px]"
            }`}
          >
            <Image
              src={image}
              alt="book_cover"
              placeholder={getPlaceholderDataURL()}
              width={outsideCart ? 50 : 100}
              height={outsideCart ? 50 : 100}
              className="image_thumb object-contain"
            />
          </div>
        </Link>
      </CloseWrapper>
      <div className="grid mr-2 w-full">
        <div className="flex gap-2 max-h-[50px] items-start">
          <div className="flex flex-col gap-2 text-justify grow">
            <p className="author_text text-xs line-clamp-2">{author}</p>
            <CloseWrapper wrap={!outsideCart}>
              <Link href={`/details/${id}`}>
                <p className="title_text text-md line-clamp-2 cursor-pointer hover:underline">
                  {title}
                </p>
              </Link>
            </CloseWrapper>
          </div>
          <div className="flex gap-3 self-center items-center px-2">
            <a
              className="remove_link hidden text-xs cursor-pointer hover:underline"
              onClick={() => removeFromCart(id)}
            >
              - Törlés
            </a>
            <p className="quantity_text text-xs">{quantity}</p>
          </div>
          <div className="price_text gap-1 flex flex-col justify-center items-end mr-2">
            <p className="text-end text-xs sm:text-sm">Online Ár: </p>
            <p> {CurrencyFormatter(price * quantity)}</p>
          </div>
        </div>
        <div className="remove_btn flex self-center justify-self-end">
          <button
            className="bg-red-400 pill_btn_base red_btn !p-[6px_20px_6px_20px]"
            onClick={() => removeFromCart(id)}
          >
            Visszarak
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CloseWrapper({ wrap = false, children }) {
  if (wrap) return <SheetClose asChild>{children}</SheetClose>;
  else return children;
}
