import Review from "@/models/review";
import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";

//GETS [max] random reviews from db or all of them if [max] is not set or 0
export const GET = async (request) => {
  const { max } = Object.fromEntries(request.nextUrl.searchParams);

  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    
    // if max is falsy then get all reviews from database with the authors
    if (!max) {
      errorProgressMessage = "Error getting reviews in database: ";

      //without a call to User table the next populate function will fail if we never querried users before
      await User.exists({});
      const DBReviews = await Review.find().populate("userRef");
      
      if (!DBReviews) {
        return Response.json({}, { status: 500 });
      }

      return new Response(JSON.stringify(DBReviews), { status: 200 });
    }

    // pick a random number up to [max] times and add that review to results if it's not there already
    errorProgressMessage = "Error picking random reviews: ";

    const reviewCount = await Review.count();
    const resultSize = reviewCount > Number(max) ? Number(max) : reviewCount;

    const aggregate = await Review.aggregate([{ $sample: { size: resultSize } }]);
    const populatedAggregate = await Review.populate(aggregate, { path: "userRef" });
    
    const results = populatedAggregate.map(randomReview => {
      return {
        id: randomReview._id.toString(),
        book: randomReview.userRef.books.find(
            (book) => book._id.toString() === randomReview.bookID.toString()
        ),
        reviewText: randomReview.reviewText,
        rating: randomReview.rating,
      }
    });

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
