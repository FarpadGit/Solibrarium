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

  let src1 = `/decor/header_brick_wall${darkMode ? "_night" : ""}.png`;
  let src2 = `/decor/header_ivy_overhang${darkMode ? "_night" : ""}.png`;

  useEffect(() => {
    src1 = `/decor/header_brick_wall${darkMode ? "_night" : ""}.png`;
    src2 = `/decor/header_ivy_overhang${darkMode ? "_night" : ""}.png`;
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
