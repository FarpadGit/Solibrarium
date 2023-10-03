"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useMediaQuery, { ScreenENUM } from "@/hooks/useMediaQuery";
import { getPlaceholderDataURL } from "@/utils/DataURL";
import { BookCover } from "book-cover-3d";

export default function BannerBookCover({ image }) {
  const screenSize = useMediaQuery();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const width =
    screenSize >= ScreenENUM.MD ? 300 : screenSize >= ScreenENUM.SM ? 200 : 150;
  const height =
    screenSize >= ScreenENUM.MD ? 450 : screenSize >= ScreenENUM.SM ? 300 : 225;
  return (
    <>
      {show && (
        <BookCover width={width} height={height}>
          <Image
            src={image}
            alt="top book"
            placeholder={getPlaceholderDataURL()}
            width={width}
            height={height}
          />
        </BookCover>
      )}
    </>
  );
}
