"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";

export default function FooterBackground() {
  const { darkMode } = useAppContext();
  const [bgSource, setBgSource] = useState("/decor/header_brick_wall.png");
  const [afterSource, setAfterSource] = useState(
    "/decor/header_ivy_overhang.png"
  );
  const backgroundStyles = {
    objectPosition: "right 0",
    objectFit: "cover",
    transform: "rotateX(180deg)",
    zIndex: -1,
  };
  const overhangStyles = {
    position: "absolute",
    minWidth: "100vw",
    maxWidth: 0,
    height: "10vw",
    left: 0,
    top: 0,
    transform: "translateY(-50%) rotateX(180deg)",
    maskImage: "linear-gradient( black 70%, transparent 100%)",
    pointerEvents: "none",
  };

  useEffect(() => {
    if (!darkMode) {
      setBgSource("/decor/header_brick_wall.png");
      setAfterSource("/decor/header_ivy_overhang.png");
    } else {
      setBgSource("/decor/header_brick_wall_night.png");
      setAfterSource("/decor/header_ivy_overhang_night.png");
    }
  }, [darkMode]);

  return (
    <>
      <Image src={bgSource} alt="" fill style={backgroundStyles} />
      <Image
        src={afterSource}
        alt=""
        width={1400}
        height={140}
        style={overhangStyles}
      />
    </>
  );
}
