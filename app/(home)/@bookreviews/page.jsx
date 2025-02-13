"use client";

import { useRef, useState } from "react";
import ReviewCard from "@/components/home/ReviewCard";
import Loading from "@/components/Loading";
import { inViewportItem } from "@/utils/ScrollAndOverlaps";
import { send } from "@/utils/FetchRequest";

const maxReviewsPerPage = 6;

export default function ReviewedBooks() {
  const [reviews, setReviews] = useState(null);
  const ViewportObserver = useRef();
  const ref = inViewportItem(ViewportObserver, handleFetch);
  async function handleFetch() {
    send(`/api/users/reviews?max=${maxReviewsPerPage}`).then((body) => {
      if (!body.error) setReviews(body);
      else setReviews([]);
    });
  }

  if (reviews === null)
    return (
      <div ref={ref}>
        <Loading />
      </div>
    );
  if (reviews.length === 0) return;
  return (
    <>
      <h2 className="separator_label_text">
        Felhasználóink személyes véleménye
      </h2>
      <div className="flex flex-wrap gap-x-3 gap-y-8 mt-12 pb-9 justify-evenly">
        {reviews.map((review, index) => (
          <ReviewCard key={`review${index}`} {...review} />
        ))}
      </div>
    </>
  );
}
