import Review from "@/models/review";
import { connectToDB } from "@/utils/DatabaseConnect";

//GETS [max] random reviews from db or all of them if [max] is not set or 0
export const GET = async (request) => {
  const { max } = Object.fromEntries(request.nextUrl.searchParams);

  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    // get all reviews from database with the authors
    errorProgressMessage = "Error getting reviews in database: ";
    const DBReviews = await Review.find().populate("userRef");

    if (!DBReviews) {
      return Response.json({}, { status: 500 });
    }

    if (!max) {
      return new Response(JSON.stringify(DBReviews), { status: 200 });
    }

    let results = [];

    // pick a random number up to [max] times and add that review to results if it's not there already
    errorProgressMessage = "Error picking random reviews: ";
    while (
      (DBReviews.length > max && results.length < max) ||
      (DBReviews.length <= max && results.length < DBReviews.length)
    ) {
      const randomNumber = Math.floor(Math.random() * DBReviews.length);
      const randomReview = DBReviews[randomNumber];
      //if not in the results already than add it
      if (
        results.findIndex((rev) => rev.id === randomReview._id.toString()) ===
        -1
      )
        results.push({
          id: randomReview._id.toString(),
          book: randomReview.userRef.books.find(
            (book) => book._id.toString() === randomReview.bookID.toString()
          ),
          reviewText: randomReview.reviewText,
          rating: randomReview.rating,
        });
    }

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
