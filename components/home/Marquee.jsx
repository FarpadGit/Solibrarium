"use client";

import MarqueeCard from "@/components/home/MarqueeCard";
import { inViewportItem } from "@/utils/ScrollAndOverlaps";
import { motion, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

export default function Marquee({ frontPageBooks }) {
  const [dragged, setDragged] = useState(false);
  const containerRef = useRef();
  const trackRef = useRef();
  const guardPixel = useRef();
  const x = useMotionValue(0);

  // when the guard pixel after the last item is visible in viewport the track will jump back to the end of the first set of items
  // (a 50% rewind into seamless transition) and resets the animation CSS property by changing it and then clearing it.
  // this will reapply the animation defined in the stylesheet and restarts the animation timer.
  //
  // (important to note that X is just the drag offset value Framer Motion uses.
  // since this value can also be positive if the user drags to the far left it's important to not let the animation end before it hits the guard pixel.)
  const guardRef = inViewportItem(
    guardPixel,
    () => {
      console.log("eh");

      const halfpoint = trackRef.current.clientWidth / 2;
      x.jump(-halfpoint + containerRef.current.clientWidth);
      trackRef.current.style.animation = "none";
      setTimeout(() => {
        trackRef.current.style.animation = "";
      }, 1);
    },
    { callOnce: false, threshold: 0 }
  );

  return (
    <div
      ref={containerRef}
      dragged={dragged ? "" : undefined}
      className="marquee_container"
    >
      <motion.div
        ref={trackRef}
        drag="x"
        _dragX={x}
        dragConstraints={containerRef}
        onDragStart={() => setDragged(true)}
        onDragEnd={() => setDragged(false)}
        style={{ x, touchAction: "none" }}
        className="marquee_track"
      >
        {frontPageBooks.map((book) => (
          <MarqueeCard key={`marqueeCard_${book.id}`} book={book} />
        ))}
        {frontPageBooks.map((book) => (
          <MarqueeCard key={`marqueeCard_${book.id}`} book={book} />
        ))}
        <div ref={guardRef}></div>
      </motion.div>
    </div>
  );
}
