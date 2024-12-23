"use client";

import MarqueeCard from "@/components/home/MarqueeCard";
import { inViewportItem } from "@/utils/ScrollAndOverlaps";
import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Marquee({ frontPageBooks }) {
  const containerRef = useRef();
  const trackRef = useRef();
  const guardPixel = useRef();
  const x = useMotionValue(0); // this is the drag offset value, can be manipulated
  const trackControls = useAnimationControls();

  // The marquee uses two CSS properties for locomotion: transform/translateX for dragging offsets and translate for moving to the right.
  //
  // The track displays 2 repeating sets of items. By default Framer Motion will try to animate the track sliding to the far right but when
  // the guard pixel after the last item is visible in the viewport the track will jump back to the end of the first set of items (a 50% rewind into seamless transition)
  //
  // This is important because we want to enable dragging which has to both exist independently from the sliding (hence the different CSS properties) and
  // not interfere with the infinite loop by prematurely letting the animation finish.
  // For this reason the Translate property is "converted" into a drag offset and resets to 0 every time the user starts to drag or the track reached its end and loops back.
  // This way the sliding animation will never reach its -100% destination and will continue running even with copious amounts of dragging.
  const guardRef = inViewportItem(guardPixel, () => onLastItemInView(), {
    callOnce: false,
    threshold: 0,
  });

  function onHoverStart() {
    // stop sliding on hover
    trackControls.stop();

    // read translate value from the style properties (yeah..)
    const translate = Number.parseFloat(
      trackRef.current.style.translate.slice(0, -4)
    );

    // convert translate percentage into pixels
    const inPixels = (trackRef.current.clientWidth * translate) / 100;

    // turn translate value into drag transform value while resetting it to 0
    x.jump(x.get() + inPixels);
    trackControls.set({ translate: "0% 0%" });
  }

  function onLastItemInView() {
    // percentage of container (visible items) relative to the whole track
    const containerPercentage =
      (100 * containerRef.current.clientWidth) / trackRef.current.clientWidth;
    // the halfway point the track has to rewind to
    const halfpointPercentage = -50 + containerPercentage;
    // same but in pixels
    const inPixels = (trackRef.current.clientWidth * halfpointPercentage) / 100;

    // set drag offset to the halfway point while resetting translate
    x.jump(inPixels);
    trackControls.set({ translate: "0% 0%" });
    trackControls.start("marquee");
  }

  const variants = {
    marquee: {
      translate: "-100% 0%",
      transition: {
        duration: 50,
        ease: "linear",
      },
    },
  };

  useEffect(() => {
    trackControls.start("marquee");
  }, []);

  return (
    <div ref={containerRef} className="marquee_container">
      <motion.div
        ref={trackRef}
        variants={variants}
        drag="x"
        _dragX={x}
        dragConstraints={containerRef}
        animate={trackControls}
        onHoverStart={() => onHoverStart()}
        onHoverEnd={() => trackControls.start("marquee")}
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
