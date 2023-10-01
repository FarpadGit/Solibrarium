import { useRouter } from "next/navigation";
import { useShoppingCartContext } from "@/contexts/ShoppingCartContext";
import { SheetClose } from "@/components/ui/Sheet";
import { CartItem } from "@/components/CartItem";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { AnimatePresence } from "framer-motion";

export function ShoppingCart() {
  const { cartItems, cartQuantity, totalPrice } = useShoppingCartContext();
  const router = useRouter();

  return (
    <div className="modal">
      <div className="text-center text-lg mb-16">Bevásárló kosaram</div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {cartItems.map((item) => (
              <CartItem
                key={item.bookData.id}
                {...item}
                className="cart_item"
              />
            ))}
          </AnimatePresence>
        </div>
        {cartQuantity > 0 ? (
          <div className="flex flex-col ms-auto font-bold text-lg mr-16 mt-4">
            <div className="self-center">
              Összesen: {CurrencyFormatter(totalPrice)}
            </div>
            <SheetClose asChild>
              <button
                className="pill_btn_base green_btn my-4 text-base"
                onClick={() => router.push("/checkout")}
              >
                Tovább a kasszához
              </button>
            </SheetClose>
          </div>
        ) : (
          <div className="text-center mt-40 w-full text-lg">
            A kosarad még üres
          </div>
        )}
      </div>
    </div>
  );
}
