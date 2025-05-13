"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShoppingCartContext } from "@/contexts/ShoppingCartContext";
import { CartItem } from "@/components/CartItem";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { send } from "@/utils/FetchRequest";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Checkout() {
  const { cartItems, cartQuantity, totalPrice, emptyCart } =
    useShoppingCartContext();
  const [discount, setDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const newLoyaltyPoints = Math.floor(totalPrice / 250);

  useEffect(() => {
    const _maxDiscount = Math.min(
      session?.user?.loyaltyPoints ?? 0,
      totalPrice
    );
    setMaxDiscount(_maxDiscount);
    if (discount > _maxDiscount) setDiscount(_maxDiscount);
  }, [totalPrice]);

  function handleConfirm() {
    if (!session?.user) router.push("/login");
    else {
      //in case the user tempers with the inputs
      const correctedDiscount = Math.min(session.user.loyaltyPoints, discount);
      const payload = {
        books: cartItems.map((item) => {
          return {
            id: item.bookData.id,
            title: item.bookData.title,
            author: item.bookData.author,
            publisher: item.bookData.publisher,
            publishedDate: item.bookData.publishedDate,
            price: item.bookData.price,
            image: item.bookData.image,
          };
        }),
        loyaltyPoints: newLoyaltyPoints - correctedDiscount,
      };

      send(`/api/users/${session.user.id}/collection`, { data: payload }).then(
        (res) => {
          if (res.error) setError(true);
          else {
            emptyCart();
            update();
            router.push("/");
          }
        }
      );
    }
  }

  return (
    <div className="flex flex-col gap-5 w-full mb-[3.6rem]">
      <div className="flex justify-between">
        <p className="font-semibold text-[1.1rem]">Kosaram</p>
        <p className="text-sm">
          Összesen:{" "}
          <span className="font-bold">{CurrencyFormatter(totalPrice)}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <AnimatePresence>
          {cartItems.map((item) => (
            <CartItem
              key={item.bookData.id}
              outsideCart
              {...item}
              className="checkout_item"
            />
          ))}
        </AnimatePresence>
        <a
          className="justify-self-end cursor-pointer font-bold hover:underline"
          onClick={() => emptyCart()}
        >
          Teljes kosár törlése
        </a>
      </div>
      <div className="flex flex-wrap gap-1 justify-between justify-items-center text-center flex-grow">
        <div className="grid grid-rows-2 grid-flow-col gap-1">
          <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
            Törzsvásárlói pontok:
          </p>
          <p className="font-semibold text-base sm:text-xl">
            {newLoyaltyPoints} pont
          </p>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-1">
          <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
            Eredeti Ár:
          </p>
          <p className="font-semibold text-base sm:text-xl">
            {CurrencyFormatter(totalPrice)}
          </p>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-1">
          <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
            Kedvezmény:
          </p>
          <p className="font-semibold text-base sm:text-xl">
            {session?.user?.loyaltyPoints > 0 ? (
              <>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => {
                    if (e.target.value > maxDiscount) setDiscount(maxDiscount);
                    else setDiscount(e.target.value);
                  }}
                  min={0}
                  max={maxDiscount}
                  style={{ width: "80px" }}
                />
                {" Ft"}
              </>
            ) : (
              CurrencyFormatter(0)
            )}
          </p>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-1">
          <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
            Fizetendő:
          </p>
          <p className="font-semibold text-base sm:text-xl">
            {CurrencyFormatter(totalPrice - discount)}
          </p>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-1">
          <p className="flex justify-center text-center text-amaranth">
            {error && "Hiba történt a szerveren"}
          </p>
          <button
            className="pill_btn_base green_btn"
            disabled={cartQuantity === 0}
            onClick={() => handleConfirm()}
          >
            Tovább
          </button>
        </div>
      </div>
    </div>
  );
}
