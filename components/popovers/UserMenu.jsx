"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { Command, CommandGroup, CommandItem } from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { signOut } from "next-auth/react";

export default function UserMenu() {
  const { getRememberMe, deleteRememberMe } = useAppContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [lanyardSwing, setLanyardSwing] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const rememberMe = getRememberMe();
  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="login_btn"
          onMouseEnter={() => setOpenDropdown(true)}
        >
          Üdvözlünk!
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0" arrow={false}>
        <div className="modal flex flex-col gap-2 bg-solibrarium px-1 rounded-[15%] overflow-hidden md:p-2">
          <Command>
            <CommandGroup>
              <CommandItem
                className="hover:bg-amber-200 dark:hover:bg-gray-400 text-center justify-center"
                onSelect={() => {
                  setOpenDropdown(false);
                  router.push("/account");
                }}
              >
                <span>Könyveim</span>
              </CommandItem>
              {rememberMe && (
                <CommandItem
                  className="hover:bg-amber-200 dark:hover:bg-gray-400 text-center justify-center"
                  onSelect={() => {
                    setOpenDropdown(false);
                    deleteRememberMe(rememberMe.Key);
                  }}
                >
                  <span>
                    Felejts el
                    <p className="text-xs">(auto bejelentkezés)</p>
                  </span>
                </CommandItem>
              )}
              <CommandItem
                className="hover:bg-amber-200 dark:hover:bg-gray-400 text-center justify-center"
                onSelect={() => {
                  setOpenDropdown(false);
                  signOut({ redirect: false });
                  if (pathName === "/account") router.push("/");
                }}
              >
                <span>Kijelentkezés</span>
              </CommandItem>
            </CommandGroup>
          </Command>
        </div>
        <div>
          <Image
            src="/decor/lanyard.png"
            alt=""
            width={200}
            height={175}
            onMouseEnter={() => {
              if (!lanyardSwing) {
                setLanyardSwing(true);
                setTimeout(() => setLanyardSwing(false), 1200);
              }
            }}
            className={`lanyard${lanyardSwing ? " swing" : ""}`}
          ></Image>
        </div>
      </PopoverContent>
    </Popover>
  );
}
