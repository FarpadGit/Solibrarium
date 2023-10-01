"use client";

import { useState } from "react";
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
  const [error, setError] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const newLoyaltyPoints = Math.floor(totalPrice / 250);

  async function handleConfirm() {
    if (session?.user) {
      //in case the user tempers with the inputs
      const correctedDiscount = Math.min(session.user.loyaltyPoints, discount);
      send({
        url: `/api/users/${session.user.id}/collection`,
        params: {
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
        },
        callback: async (res) => {
          if (res.error) setError(true);
          else {
            emptyCart();
            router.push("/");
          }
        },
      });
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col gap-5 w-full mb-[3.6rem]">
      <div className="flex justify-between">
        <p className="font-semibold text-[1.1rem]">Kosaram</p>
        <p className="text-sm">Összesen: {CurrencyFormatter(totalPrice)}</p>
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
          className="justify-self-end cursor-pointer hover:underline"
          onClick={() => emptyCart()}
        >
          Teljes kosár törlése
        </a>
      </div>
      <div className="grid grid-rows-2 grid-flow-col gap-1 justify-between justify-items-center text-center">
        <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
          Törzsvásárlói pontok:
        </p>
        <p className="font-semibold text-base sm:text-xl">
          {newLoyaltyPoints} pont
        </p>
        <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
          Eredeti Ár:
        </p>
        <p className="font-semibold text-base sm:text-xl">
          {CurrencyFormatter(totalPrice)}
        </p>
        <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
          Kedvezmény:
        </p>
        <p className="font-semibold text-base sm:text-xl">
          {session?.user?.loyaltyPoints > 0 ? (
            <>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min={0}
                max={session.user.loyaltyPoints}
                style={{ width: "80px" }}
              />
              {" Ft"}
            </>
          ) : (
            CurrencyFormatter(0)
          )}
        </p>
        <p className="text-base sm:text-xl text-[#555] dark:text-[#CCC]">
          Fizetendő:
        </p>
        <p className="font-semibold text-base sm:text-xl">
          {CurrencyFormatter(totalPrice - discount)}
        </p>
        <p className="flex justify-center text-center text-red-600">
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
  );
}
