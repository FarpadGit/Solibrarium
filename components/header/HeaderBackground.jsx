"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";

export default function HeaderBackground() {
  const { darkMode } = useAppContext();
  const [bgSource, setBgSource] = useState("/decor/header_brick_wall.png");
  const [afterSource, setAfterSource] = useState(
    "/decor/header_ivy_overhang.png"
  );
  const backgroundStyles = {
    objectPosition: "right calc(100% + 2vw)",
    objectFit: "cover",
    zIndex: -1,
  };
  const overhangStyles = {
    position: "fixed",
    minWidth: "100vw",
    maxWidth: 0,
    height: "10vw",
    left: 0,
    top: "calc(var(--header-current-height) + 2.0vw)",
    transform: "translateY(-50%)",
    maskImage: "linear-gradient( black 70%, transparent 100%)",
    zIndex: -1,
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
