"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useDarkMode from "@/hooks/useDarkMode";
import { send } from "@/utils/FetchRequest";
import { signIn, signOut, useSession } from "next-auth/react";

const appContext = createContext();
export const useAppContext = () => useContext(appContext);

export default ({ children }) => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  const loginUser = async (params) => {
    setIsLoggingIn(true);
    return signIn("SolibrariumProvider", params).finally(() =>
      setIsLoggingIn(false)
    );
  };
  const loginUserWithGoogle = async () => {
    setIsLoggingIn(true);
    return signIn("google").finally(() => setIsLoggingIn(false));
  };
  const loginUserWithRememberMe = async () => {
    const rememberMeToken = getRememberMe();
    if (!rememberMeToken) return;

    setIsLoggingIn(true);

    const signInResult = await signIn("RememberMeProvider", {
      redirect: false,
      tokenKey: rememberMeToken.Key,
      tokenValue: rememberMeToken.Value,
    });

    if (signInResult.error) {
      deleteRememberMe(rememberMeToken.Key);
      setIsLoggingIn(false);
      return;
    }

    const response = await send("/api/rememberMe", {
      data: {
        tokenKey: rememberMeToken.Key,
      },
    });

    if (!response.error)
      localStorage.setItem("RememberMe", JSON.stringify(response));
    setIsLoggingIn(false);
  };

  const logOutUser = () => {
    signOut({ redirect: false });
    if (pathName === "/account") router.push("/");
  };

  const deleteUser = () => {
    if (!session?.user) return;
    logOutUser();
    const rememberMe = getRememberMe();
    if (rememberMe) deleteRememberMe(rememberMe.Key);
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

  useEffect(() => {
    loginUserWithRememberMe();
  }, []);

  return (
    <appContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        loginUser,
        loginUserWithGoogle,
        isLoggingIn,
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
