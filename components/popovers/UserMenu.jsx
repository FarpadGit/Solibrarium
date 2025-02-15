"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { Command, CommandGroup, CommandItem } from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
const swingDuration = 1000;

export default function UserMenu() {
  const { getRememberMe, deleteRememberMe, openConfirmModal, logOutUser } =
    useAppContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [lanyardSwing, setLanyardSwing] = useState(false);
  const router = useRouter();
  const rememberMe = getRememberMe();

  function MenuItem({ label, sublabel = null, click }) {
    return (
      <CommandItem
        className="hover:bg-amber-200 dark:hover:bg-gray-400 text-center justify-center hover:cursor-pointer"
        onSelect={() => {
          setOpenDropdown(false);
          click();
        }}
      >
        <span>
          {label}
          {sublabel && <p className="text-xs">{sublabel}</p>}
        </span>
      </CommandItem>
    );
  }

  return (
    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="login_btn header_btn_base hover:cursor-default"
          onMouseEnter={() => setOpenDropdown(true)}
        >
          Üdvözlünk!
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0" arrow={false}>
        <div className="modal flex flex-col gap-2 bg-solibrarium px-1 rounded-[15%] overflow-hidden md:p-2">
          <Command>
            <CommandGroup>
              <MenuItem
                label="Könyveim"
                click={() => {
                  router.push("/account");
                }}
              />
              {rememberMe && (
                <MenuItem
                  label="Felejts el"
                  sublabel="(auto bejelentkezés)"
                  click={() => {
                    deleteRememberMe(rememberMe.Key);
                  }}
                />
              )}
              <MenuItem
                label="Fiók törlése"
                click={() => {
                  openConfirmModal();
                }}
              />
              <MenuItem
                label="Kijelentkezés"
                click={() => {
                  logOutUser();
                }}
              />
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
              if (lanyardSwing) return;
              setLanyardSwing(true);
              setTimeout(() => setLanyardSwing(false), swingDuration + 100);
            }}
            className={`lanyard${lanyardSwing ? " swing" : ""}`}
            style={{ "--swingDuration": swingDuration + "ms" }}
          ></Image>
        </div>
      </PopoverContent>
    </Popover>
  );
}
