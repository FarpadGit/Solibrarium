"use client";

import { useContext, createContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const shoppingCartContext = createContext();
export const useShoppingCartContext = () => useContext(shoppingCartContext);

export default ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);

  const cartQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const hasItem = (id) => {
    return cartItems.find((item) => item.bookData.id === id) ? true : false;
  };

  const addToCart = (book) => {
    setCartItems((prev) => [...prev, { bookData: book, quantity: 1 }]);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.bookData.id !== id));
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, cartItem) =>
          total + cartItem.bookData.price * cartItem.quantity,
        0
      ),
    [cartItems]
  );

  const ShoppingCartFunctions = {
    hasItem,
    addToCart,
    removeFromCart,
    emptyCart,
    cartItems,
    cartQuantity,
    totalPrice,
  };

  return (
    <shoppingCartContext.Provider value={ShoppingCartFunctions}>
      {children}
    </shoppingCartContext.Provider>
  );
};
