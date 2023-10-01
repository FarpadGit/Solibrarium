"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import UserBooks from "@/components/account/UserBooks";
import BookReviewCard from "@/components/account/BookReviewCard";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";

export default function Account() {
  const { data: session, status } = useSession();
  const [showReviewCard, setShowReviewCard] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const selectedBookRef = useRef(null);

  useEffect(() => {
    if (selectedBook) setShowReviewCard(true);
  }, [selectedBook]);

  if (status === "unauthenticated") {
    return (
      <div className="relative flex flex-col items-center justify-center w-full mb-7">
        <div className="centerpiece_container shadow-[0_0_3rem_1rem_red]">
          <Image
            src="/accountLoggedOut.jpg"
            alt=""
            fill
            className="grayscale"
          />
          <div className="absolute flex flex-col w-full px-[20%] py-3 top-[2%] left-[50%] items-center text-center -translate-x-1/2 gap-3 bg-solibrarium">
            <div className="text-xs md:text-sm lg:text-base">
              Valami rejtélyes erő védheti a titkos szobát, mert amint
              kijelentkeztél sehogy sem tudod megtalálni az oda vezető utat!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full mb-7">
      {/* center */}
      <div className="centerpiece_container shadow-[0_0_3rem_1rem_var(--glow-color)]">
        <Image src="/accountLoggedIn.jpg" alt="" fill />
        <div className="absolute flex flex-col w-full px-[15%] py-3 top-[2%] left-[50%] items-center text-center -translate-x-1/2 gap-3 bg-solibrarium">
          <h1 className="font-bold text-lg md:text-xl lg:text-3xl">
            Üdv a titkos szobában!
          </h1>
          <div className="text-xs md:text-sm lg:text-base">
            Ezt a helyet a tetőre vezető lépcsőházban fedezted fel egyszer
            véletlenül, és most itt tartod az összegyűjtött könyveidet
          </div>
        </div>
      </div>
      {/* userbooks */}
      <div className="userbooks_wrapper">
        {/* left - bookshelf */}
        <div className="loyalty_display">
          Aktuális hűségpontok: <b>{session.user.loyaltyPoints} pont</b>
        </div>
        <div className="bookshelf_wrapper">
          <div className="bookshelf_container">
            <UserBooks
              selected={selectedBook}
              setSelected={setSelectedBook}
              ref={selectedBookRef}
            />
          </div>
        </div>

        {/* right - review card */}
        <div className="bookreview_container">
          <AnimatePresence mode="wait">
            {showReviewCard && (
              <BookReviewCard
                key={selectedBook.id}
                close={() => {
                  setShowReviewCard(false);
                  selectedBookRef.current.focus();
                  setSelectedBook(null);
                }}
                user={session.user.id}
                bookDetails={selectedBook}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
