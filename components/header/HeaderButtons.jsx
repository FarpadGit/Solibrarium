"use client";

import { useAppContext } from "@/contexts/AppContext";
import { useShoppingCartContext } from "@/contexts/ShoppingCartContext";
import { ShoppingCart } from "@/components/shoppingcart/ShoppingCart";
import LoginButton from "@/components/ui/LoginButton";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { Label as FormLabel } from "@/components/ui/FormLabel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

export default function HeaderButtons() {
  const { darkMode, setDarkMode } = useAppContext();
  const { cartQuantity } = useShoppingCartContext();

  return (
    <div className="grid grid-cols-1 gap-2 items-center justify-center justify-items-center flex-wrap md:flex md:gap-2 md:justify-end lg:gap-3">
      {/* Shopping Cart button */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="header_icon rounded-full w-6 h-6 relative md:w-8 md:h-8 md:mr-2">
            <ShoppingCartIcon />
            {cartQuantity > 0 && (
              <div className="rounded-full bg-red-500 text-sm text-white w-4 h-4 flex justify-center items-center absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 md:text-base md:w-5 md:h-5">
                {cartQuantity}
              </div>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="ShoppingCart">
          <ShoppingCart />
        </SheetContent>
      </Sheet>

      {/* Login button */}
      <LoginButton />
      {/* Theme switch */}
      <div className="flex flex-col items-center justify-center w-[60px] lg:w-[70px]">
        <ThemeSwitch
          id="Theme-toggle"
          checked={darkMode}
          className="header_btn"
          onCheckedChange={() => setDarkMode((prev) => !prev)}
        />
        <FormLabel htmlFor="Theme-toggle" className="text-white text-xs">
          {darkMode ? "Hold mód" : "Nap mód"}
        </FormLabel>
      </div>
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <div className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        alt="Shopping Cart"
      >
        <title id="ShoppingCartIcon">Shopping Cart</title>
        <path
          fill="var(--foreground-color)"
          d="M 96 0 C 107.5 0 117.4 8.2 119.6 19.5 L 121.1 32 H 541.8 C 562.1 32 578.3 52.3 572.6 72.7 L 518.6 264.7 C 514.7 278.5 502.1 288 487.8 288 H 170.7 L 179.9 336 H 488 C 501.3 336 512 346.7 512 360 C 512 373.3 501.3 384 488 384 H 159.1 C 148.5 384 138.6 375.8 136.4 364.5 L 76.1 48 H 24 C 10.8 48 0 37.3 0 24 C 0 10.8 10.8 0 24 0 H 96 z M 128 464 C 128 437.5 149.5 416 176 416 C 202.5 416 224 437.5 224 464 C 224 490.5 202.5 512 176 512 C 149.5 512 128 490.5 128 464 z M 512 464 C 512 490.5 490.5 512 464 512 C 437.5 512 416 490.5 416 464 C 416 437.5 437.5 416 464 416 C 490.5 416 512 437.5 512 464 z"
        />
      </svg>
    </div>
  );
}
