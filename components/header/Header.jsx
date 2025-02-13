"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { useHeaderVisibilityContext } from "@/contexts/HeaderVisibilityContext";
import { useSearchBarContext } from "@/contexts/SearchBarContext";
import Logo from "@/components/header/Logo";
import Searchbars from "@/components/header/Searchbars";
import HeaderBackground from "@/components/header/HeaderBackground";
import HeaderButtons from "@/components/header/HeaderButtons";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import dynamic from "next/dynamic";
const TECollapse = dynamic(
  () => import("tw-elements-react").then((res) => res.TECollapse),
  { ssr: false }
);

export default function Header() {
  const { toggleCollapsedButtons, areButtonsCollapsed } = useAppContext();
  const { isHeaderMinimized, maximizeHeader } = useHeaderVisibilityContext();

  const headerRef = useRef(null);
  useScrollHandler(headerRef);

  const pathName = usePathname();
  const prevPathName = useRef("");


    prevPathName.current = pathName;
  }, [pathName]);

  return (
    <nav
      ref={headerRef}
      className={`header ${
        !isHeaderMinimized ? "header_full" : "header_short"
      }`}
    >
      {/* Header Background Images */}
      <HeaderBackground />

      <div className="relative flex justify-between grow">
        <Logo />

        <Searchbars />

        {/* Right side buttons - Desktop Navigation */}
        <div className="hidden md:block">
          <HeaderButtons />
        </div>

        {/* Right side buttons - Mobile Navigation */}
        <div className="block w-1/5 md:hidden">
          <div className="flex justify-center">
            <button
              onClick={() => {
                maximizeHeader();
                toggleCollapsedButtons();
              }}
              className="misc_btn drop-shadow-star min-w-[50px]"
            >
              {"\u25bc" /* ▼ */}
            </button>
          </div>
          <div className="flex justify-center">
            <TECollapse
              className="fixed flex justify-center border border-black overflow-hidden"
              show={areButtonsCollapsed}
            >
              <div className="rounded-2xl z-50">
                <HeaderBackground
                  withOverhang={false}
                  verticalOffset="-5"
                  className="scale-[200%]"
                />
                <div className="px-2 py-4">
                  <HeaderButtons />
                </div>
              </div>
            </TECollapse>
          </div>
        </div>
      </div>
    </nav>
  );
}
