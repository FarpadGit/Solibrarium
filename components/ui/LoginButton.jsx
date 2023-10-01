"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAppContext } from "@/contexts/AppContext";
import { useSession } from "next-auth/react";
const UserMenu = dynamic(
  () => import("@/components/popovers/UserMenu").then((res) => res.default),
  { ssr: false }
);

export default function LoginButton() {
  const [animate, setAnimate] = useState(false);
  const { data: session } = useSession();
  const { setShowLoginModal } = useAppContext();

  setRememberMe(session?.rememberMe);
  return (
    <div className="flex flex-col w-[70px] h-[45px] justify-between md:w-[90px] md:h-[55px]">
      {!session?.user ? (
        <>
          <button
            type="button"
            className="login_btn header_btn"
            onClick={() => setAnimate(true)}
            onAnimationEnd={() => {
              setShowLoginModal(true);
              setAnimate(false);
            }}
            pushed={animate ? "" : undefined}
          >
            Belépés
          </button>
          <Link
            href="/register"
            className="text-white hover:text-[#ccc] hover:underline text-xs self-center md:text-sm"
          >
            Regisztrálok
          </Link>
        </>
      ) : (
        <UserMenu />
      )}
    </div>
  );
}

function setRememberMe(rememberMeToken) {
  const { RememberMeKey = null, RememberMeValue = null } =
    rememberMeToken || {};
  if (RememberMeKey && RememberMeValue && typeof window !== "undefined")
    localStorage.setItem(
      "RememberMe",
      JSON.stringify({ key: RememberMeKey, value: RememberMeValue })
    );
}
