"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function StarRating({ rating, size = 15, setter = null }) {
  const roundedRating = rating ? Math.round(rating * 2) / 2 : 0;
  const [hoverRating, setHoverRating] = useState(0);
  const [starArray, setStarArray] = useState(ratingToArray(roundedRating));

  useEffect(() => {
    if (hoverRating !== 0) setStarArray(ratingToArray(hoverRating));
    else setStarArray(ratingToArray(roundedRating));
  }, [rating, hoverRating]);

  return (
    <span className="flex">
      {starArray.map((star, index) => (
        <Star key={`star${index}`} src={star} value={index + 1} />
      ))}
    </span>
  );

  function Star({ src, value }) {
    return (
      <Image
        key={value}
        src={src}
        alt=""
        width={size}
        height={size}
        onClick={setter === null ? undefined : () => setter(value)}
        onMouseEnter={setter === null ? undefined : () => setHoverRating(value)}
        onMouseLeave={setter === null ? undefined : () => setHoverRating(0)}
        onContextMenu={
          setter === null
            ? undefined
            : (e) => {
                e.preventDefault();
                setter(0);
              }
        }
        className={`star object-contain ${
          setter === null ? "cursor-default" : "cursor-pointer"
        }`}
      />
    );
  }

  function ratingToArray(rating) {
    let i,
      output = [];
    for (i = rating; i >= 1; i--) output.push("/icons/star-filled.svg");
    if (i == 0.5) output.push("/icons/star-half-filled.svg");
    for (i = 5 - rating; i >= 1; i--) output.push("/icons/star-empty.svg");

    return output;
  }
}
