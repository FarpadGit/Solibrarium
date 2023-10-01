"use client";

import { useContext, createContext, useState } from "react";
import dynamic from "next/dynamic";
import HeaderVisibilityContext from "@/contexts/HeaderVisibilityContext";
import FilterContext from "@/contexts/FilterContext";
import SearchBarContext from "@/contexts/SearchBarContext";
import SearchContext from "@/contexts/SearchContext";
import ShoppingCartContext from "@/contexts/ShoppingCartContext";
import useDarkMode from "@/hooks/useDarkMode";
import { send } from "@/utils/FetchRequest";
const LoginModal = dynamic(
  () => import("@/components/popovers/LoginModal").then((res) => res.default),
  { ssr: false }
);

const appContext = createContext();
export const useAppContext = () => useContext(appContext);

export default ({ children }) => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCollapsedButtons, setShowCollapsedButtons] = useState(false);
  const toggleCollapsedButtons = () => setShowCollapsedButtons((prev) => !prev);

  const getRememberMe = () =>
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("RememberMe"));

  async function deleteRememberMe(key) {
    localStorage.removeItem("RememberMe");
    send({
      url: "/api/rememberMe",
      method: "DELETE",
      params: {
        tokenKey: key,
      },
    });
  }
  return (
    <appContext.Provider
      value={{
        darkMode,
        setDarkMode,
        showLoginModal,
        setShowLoginModal,
        showCollapsedButtons,
        toggleCollapsedButtons,
        getRememberMe,
        deleteRememberMe,
      }}
    >
      <HeaderVisibilityContext>
        <SearchBarContext>
          <FilterContext>
            <SearchContext>
              <ShoppingCartContext>
                <LoginModal />
                {children}
              </ShoppingCartContext>
            </SearchContext>
          </FilterContext>
        </SearchBarContext>
      </HeaderVisibilityContext>
    </appContext.Provider>
  );
};
