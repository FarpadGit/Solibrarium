"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StarRating from "@/components/ui/StarRating";
import useMediaQuery, { ScreenENUM } from "@/hooks/useMediaQuery";
import { send } from "@/utils/FetchRequest";
import { getPlaceholderDataURL } from "@/utils/DataURL";
import { motion } from "framer-motion";

export default function BookReviewCard({ user, bookDetails, close }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(false);
  const screenSize = useMediaQuery();

  async function handleSubmit(e) {
    e.preventDefault();
    if (reviewText === "" && rating === 0) return;
    const payload = {
      review: {
        reviewText: reviewText,
        rating: rating,
      },
    };

    send(`/api/users/${user}/collection/reviews/${bookDetails._id}`, {
      data: payload,
    }).then((res) => {
      if (res.error) setError(true);
      else {
        close();
      }
    });
  }

  useEffect(() => {
    send(`/api/users/${user}/collection/reviews/${bookDetails._id}`).then(
      (res) => {
        if (res.error) setError(true);
        else {
          setReviewText(res.reviewText);
          setRating(res.rating);
        }
      }
    );
  }, []);

  return (
    <motion.div
      initial={{ y: "2.5rem", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "2.5rem", opacity: 0 }}
      transition={{ type: "tween" }}
      className="card bookreview_card"
      onKeyUp={(e) => {
        if (e.code === "Escape") close();
      }}
    >
      <button
        id="review_close_btn"
        className="absolute pill_btn_base red_btn"
        onClick={close}
        autoFocus
      >
        {"\u25bc"}
      </button>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center self-start">
          <div className="flex w-10/12 gap-5 pt-4 pb-2">
            <Image
              src={bookDetails.image}
              alt="book cover"
              placeholder={getPlaceholderDataURL()}
              width={screenSize >= ScreenENUM.XL ? 150 : 100}
              height={screenSize >= ScreenENUM.XL ? 225 : 150}
              className="outline outline-1 outline-transparent min-w-[100px] h-[150px] xl:min-w-[150px] xl:min-h-[225px]"
            />
            <div className="flex flex-col gap-2 items-center text-center w-full">
              <div className="text-sm py-0.5">{bookDetails.author}</div>
              <div className="text-3xl line-clamp-3 scroll_on_hover h-[6.75rem]">
                {bookDetails.title}
              </div>
              {bookDetails.subtitle && (
                <div className="text-lg py-0.5">{bookDetails.subtitle}</div>
              )}
              {bookDetails.publisher && (
                <div className="text-xs pt-0.5 md:pb-7">
                  {[bookDetails.publisher, bookDetails.publishedDate].join(
                    ", "
                  )}
                </div>
              )}
              <div>
                <StarRating rating={rating} setter={setRating} size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className={`text-center${error ? " text-amaranth" : ""}`}>
            {error
              ? "Hiba történt a szerveren"
              : "Írj egy kritikát a könyvről és küldd el, hogy mások is lássák:"}
          </p>
          <div className="review_text_wrapper">
            <ParchmentBorder />
            <textarea
              name="ReviewTextArea"
              id="ReviewTextArea"
              cols={
                screenSize >= ScreenENUM.XL
                  ? "55"
                  : screenSize >= ScreenENUM.SM
                  ? "44"
                  : "33"
              }
              rows="30"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="pill_btn_base green_btn -translate-y-1/2 z-1"
          >
            Mentés
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function ParchmentBorder() {
  return (
    <svg style={{ width: 0, height: 0 }}>
      <filter id="parchmentBorder">
        <feTurbulence
          x="0"
          y="0"
          baseFrequency="0.02"
          numOctaves="5"
          seed="1"
        />
        <feDisplacementMap in="SourceGraphic" scale="20" />
      </filter>
    </svg>
  );
}
