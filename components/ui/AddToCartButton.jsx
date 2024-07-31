"use client";

import { useRef, useState } from "react";
import { useShoppingCartContext } from "@/contexts/ShoppingCartContext";

export default function AddToCartButton({ book }) {
  const { addToCart, hasItem } = useShoppingCartContext();
  const [animate, setAnimate] = useState(false);
  const ref = useRef();
  return (
    <button
      ref={ref}
      className="add_to_cart_btn green_btn pill_btn_base"
      disabled={!book?.price || hasItem(book.id)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (ref.current) {
          ref.current.style.setProperty(
            "--bottonTop",
            `${ref.current?.getBoundingClientRect().top}px`
          );
          ref.current.style.setProperty(
            "--bottonLeft",
            `${ref.current?.getBoundingClientRect().left}px`
          );
        }
        setAnimate(true);
        addToCart(book);
      }}
      onAnimationEnd={() => setAnimate(false)}
      pushed={animate ? "" : undefined}
    >
      {`${
        !book?.price
          ? "Nem elérhető"
          : `${hasItem(book.id) ? "Már kosárban" : "Kosárba"}`
      }`}
    </button>
  );
}
