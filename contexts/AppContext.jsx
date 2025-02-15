"use client";

import { useContext, createContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useDarkMode from "@/hooks/useDarkMode";
import { send } from "@/utils/FetchRequest";
import { signOut, useSession } from "next-auth/react";

const appContext = createContext();
export const useAppContext = () => useContext(appContext);

export default ({ children }) => {
  const [darkMode, setDarkMode] = useDarkMode();
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  const logOutUser = () => {
    signOut({ redirect: false });
    if (pathName === "/account") router.push("/");
  };

  const deleteUser = () => {
    if (!session?.user) return;
    logOutUser();
    localStorage.removeItem("RememberMe");
    send(`/api/users/${session.user.id}`, {
      method: "DELETE",
      data: {},
    });
  };

  const getRememberMe = () => {
    if (typeof window === "undefined") return null;
    const LSRememberMe = JSON.parse(localStorage.getItem("RememberMe"));
    return LSRememberMe;
  };

  async function deleteRememberMe(key) {
    localStorage.removeItem("RememberMe");
    send("/api/rememberMe", {
      method: "DELETE",
      data: {
        tokenKey: key,
      },
    });
  }
  return (
    <appContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        logOutUser,
        deleteUser,
        getRememberMe,
        deleteRememberMe,
      }}
    >
      {children}
    </appContext.Provider>
  );
};
