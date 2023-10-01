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
  const width =
    screenSize >= ScreenENUM.MD ? 300 : screenSize >= ScreenENUM.SM ? 200 : 175;
  const height =
    screenSize >= ScreenENUM.MD ? 450 : screenSize >= ScreenENUM.SM ? 300 : 262;
  return (
    <>
      {show && (
        <BookCover width={width} height={height}>
          <Image
            src={image}
            alt="top book"
            placeholder="blur"
            blurDataURL="/book_loading.jpg"
            width={width}
            height={height}
          />
        </BookCover>
      )}
    </>
  );
}
