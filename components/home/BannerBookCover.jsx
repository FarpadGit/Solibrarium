"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useMediaQuery, { ScreenENUM } from "@/hooks/useMediaQuery";
import { BookCover } from "book-cover-3d";

export default function BannerBookCover({ image }) {
  const screenSize = useMediaQuery();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <>
      {show && (
        <BookCover
          width={screenSize >= ScreenENUM.MD ? 300 : 200}
          height={screenSize >= ScreenENUM.MD ? 450 : 300}
        >
          <Image
            src={image}
            alt="top book"
            placeholder="blur"
            blurDataURL="/book_loading.jpg"
            width={screenSize >= ScreenENUM.MD ? 300 : 200}
            height={screenSize >= ScreenENUM.MD ? 450 : 300}
          />
        </BookCover>
      )}
    </>
  );
}
