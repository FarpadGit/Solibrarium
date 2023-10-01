"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";

export default function FooterBackground() {
  const { darkMode } = useAppContext();
  const backgroundStyles = {
    objectPosition: "right 0",
    objectFit: "cover",
    transform: "rotateX(180deg)",
    zIndex: -1,
  };
  const overhangStyles = {
    position: "absolute",
    minWidth: "100vw",
    height: "10vw",
    left: 0,
    top: 0,
    transform: "translateY(-50%) rotateX(180deg)",
    maskImage: "linear-gradient( black 70%, transparent 100%)",
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
