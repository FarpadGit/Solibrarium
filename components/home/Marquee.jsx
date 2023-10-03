"use client";

import MarqueeCard from "@/components/home/MarqueeCard";
import { motion, useDragControls } from "framer-motion";
import { useState, useRef } from "react";

export default function Marquee({ frontPageBooks }) {
  const [dragged, setDragged] = useState(false);
  const controls = useDragControls();
  const ref = useRef();
  return (
    <div
      ref={ref}
      className="marquee_container"
      dragged={dragged ? "" : undefined}
    >
      <motion.div
        drag="x"
        dragControls={controls}
        dragConstraints={ref}
        onPointerDown={(e) => {
          controls.start(e);
          setDragged(true);
        }}
        onPointerCancel={() => setDragged(false)}
        style={{ touchAction: "none" }}
        className="marquee_track"
      >
        {frontPageBooks.map((book) => (
          <MarqueeCard key={`marqueeCard_${book.id}`} book={book} />
        ))}
        {frontPageBooks.map((book) => (
          <MarqueeCard key={`marqueeCard_2_${book.id}`} book={book} />
        ))}
      </motion.div>
    </div>
  );
}
