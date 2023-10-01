"use client";

import { useRef, useState } from "react";
import ReviewCard from "@/components/home/ReviewCard";
import Loading from "@/components/Loading";
import { InViewportItem } from "@/utils/InfiniteScroll";
import { send } from "@/utils/FetchRequest";

export default function ReviewedBooks() {
  const [reviews, setReviews] = useState(null);
  const ViewportObserver = useRef();
  const ref = InViewportItem(ViewportObserver, handleFetch);
  async function handleFetch() {
    send({
      url: "/api/users/reviews?max=6",
      callback: (body) => {
        if (!body.error) setReviews(body);
        else setReviews([]);
      },
    });
  }

  return (
    <>
      <h2 ref={ref} className="separator_label_text">
        Felhasználóink személyes véleménye
      </h2>
      {reviews?.length > 0 ? (
        <div className="flex flex-wrap gap-x-3 gap-y-8 mt-12 pb-9 justify-evenly">
          {reviews.map((review, index) => (
            <ReviewCard key={`review${index}`} {...review} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
