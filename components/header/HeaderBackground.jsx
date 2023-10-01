"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";

export default function HeaderBackground() {
  const { darkMode } = useAppContext();
  const backgroundStyles = {
    objectPosition: "right calc(100% + 2vw)",
    objectFit: "cover",
    zIndex: -1,
  };
  const overhangStyles = {
    position: "fixed",
    minWidth: "100vw",
    height: "10vw",
    left: 0,
    top: "calc(var(--header-current-height) + 2.0vw)",
    transform: "translateY(-50%)",
    maskImage: "linear-gradient( black 70%, transparent 100%)",
    zIndex: -1,
    pointerEvents: "none",
  };

  let src1 = !darkMode
    ? "/decor/header_brick_wall.png"
    : "/decor/header_brick_wall_night.png";
  let src2 = !darkMode
    ? "/decor/header_ivy_overhang.png"
    : "/decor/header_ivy_overhang_night.png";

  useEffect(() => {
    src1 = !darkMode
      ? "/decor/header_brick_wall.png"
      : "/decor/header_brick_wall_night.png";
    src2 = !darkMode
      ? "/decor/header_ivy_overhang.png"
      : "/decor/header_ivy_overhang_night.png";
  }, [darkMode]);

  return (
    <>
      <Image src={src1} alt="" fill style={backgroundStyles} />
      <Image
        src={src2}
        alt=""
        width={1400}
        height={140}
        style={overhangStyles}
      />
    </>
  );
}
