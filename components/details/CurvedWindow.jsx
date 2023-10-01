"use client";

import { useEffect, useRef } from "react";

export default function CurvedWindow() {
  const ref = useRef();
  useEffect(() => {
    function handleScroll() {
      if (ref.current)
        ref.current.style.setProperty(
          "--scrollOffsetY",
          `${-window.scrollY / 3}px`
        );
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Variables safe to redefine for different images */
  /* use the .curved_window class in CSS to redefine these values */
  /* (image-source, component width/height, image width/height, offset of image from topleft corner (negatives move down/right))  */
  const windowVariables = {
    "--imgSrc": "var(--global-background-image)",
    "--sizeWidth": "254px",
    "--sizeHeight": "152px",
    "--imgSizeWidth": "1024px",
    "--imgSizeHeight": "576px",
    "--imgOffsetX": "-200px",
    "--imgOffsetY": "-100px",
  };
  /* ...Yeah, don't touch any of these */
  const windowStyles = {
    ...windowVariables,
    "--mouseOffsetX": "calc(var(--sizeWidth) / -2)",
    "--mouseOffsetY": "calc(var(--sizeHeight) / -2)",
    "--scrollOffsetY": "0px",
    "--img2OffsetY": "0px",
  };

  const secondWindowOffset = "calc(-16 * var(--sizeWidth) / 100)";
  const minLeftValue = "calc(-1 * var(--imgSizeWidth) + var(--sizeWidth))";
  const maxLeftValue = "0px";
  const minTopValue = `calc(-1 * var(--imgSizeHeight) + var(--sizeHeight) + (${secondWindowOffset} + var(--sizeHeight)) + var(--img2OffsetY))`;
  const maxTopValue = "0px";

  const imgStyles = {
    width: "var(--sizeWidth)",
    height: "var(--sizeHeight)",
    border: "1px solid",
    borderRadius: "0 30% 0 0",
    backgroundImage: "var(--imgSrc)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "var(--imgSizeWidth) var(--imgSizeHeight)",
    backgroundPosition: `left clamp(${minLeftValue}, calc(var(--imgOffsetX) + var(--mouseOffsetX)), ${maxLeftValue}) top clamp(${minTopValue}, calc(var(--imgOffsetY) + var(--scrollOffsetY) + var(--mouseOffsetY) + var(--img2OffsetY)), ${maxTopValue})`,
    maskImage:
      "radial-gradient(calc(var(--sizeWidth) / 3) calc(var(--sizeHeight) / 3) at calc(var(--sizeWidth) * 0.733) calc(var(--sizeHeight) * 0.973), transparent 80%, black 81%), linear-gradient(to bottom, transparent 70%, black 71%), linear-gradient(to right, transparent 70%, black 71%)",
    maskComposite: "subtract",
    WebkitMaskImage:
      "radial-gradient(calc(var(--sizeWidth) / 3) calc(var(--sizeHeight) / 3) at calc(var(--sizeWidth) * 0.733) calc(var(--sizeHeight) * 0.973), transparent 80%, black 81%), linear-gradient(to bottom, transparent 70%, black 71%), linear-gradient(to right, transparent 70%, black 71%)",
    WebkitMaskComposite: "source-out",
    transition: "background-position 0.2s ease-out",
  };
  const offsetStyles = {
    position: "relative",
    top: secondWindowOffset,
    "--img2OffsetY": `calc(-1 * (${secondWindowOffset} + var(--sizeHeight)))`,
  };

  function onMouseMove(e) {
    const offsetX = e.clientX - ref.current.getBoundingClientRect().left;
    const offsetY = e.clientY - ref.current.getBoundingClientRect().top;
    ref.current.style.setProperty(
      "--mouseOffsetX",
      offsetX > 0 ? `-${offsetX * (400 / e.target.clientWidth)}px` : "0px"
    );
    ref.current.style.setProperty(
      "--mouseOffsetY",
      offsetY > 0 ? `-${offsetY}px` : "0px"
    );
  }

  return (
    <div
      ref={ref}
      className="flex flex-col h-0"
      onMouseMove={onMouseMove}
      style={windowStyles}
    >
      <div className="curved_window">
        <div style={imgStyles}></div>
      </div>
      <div className="curved_window" style={offsetStyles}>
        <div style={imgStyles}></div>
      </div>
    </div>
  );
}
