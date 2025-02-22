import User from "@/models/user";
import Review from "@/models/review";
import { connectToDB } from "@/utils/DatabaseConnect";

//GETS a review for one of the user's books or a default empty response
export const GET = async (request, { params }) => {
  const { userID, bookID } = await params;
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    // get user from database
    errorProgressMessage = "Error finding user in database: ";
    const dbUser = await User.findById(userID).populate("reviews");

    if (!dbUser) {
      return Response.json(
        { error: `couldn't find user ID ${userID} in database` },
        { status: 404 }
      );
    }

    //get review from user's reviews
    errorProgressMessage = "Error finding review in user's database: ";
    const review = dbUser.reviews.find(
      (review) => review.bookID.toString() === bookID
    );
    return Response.json(
      review ?? {
        userRef: userID,
        bookID: bookID,
        reviewText: "",
        rating: 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

//POSTS one review and adds it to db
export const POST = async (request, { params }) => {
  const { userID, bookID } = await params;
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    const reqBody = await request.json();
    // get user from database
    errorProgressMessage = "Error finding user in database: ";
    const dbUser = await User.findById(userID);

    if (!dbUser) {
      return Response.json(
        { error: `couldn't find user ID ${userID} in database` },
        { status: 404 }
      );
    }

    // check if review exists in database
    errorProgressMessage = "Error looking up review in database: ";
    const dbReview = await Review.findOne({
      userRef: userID,
      bookID: bookID,
    });
    //if it exists, update it
    if (dbReview) {
      errorProgressMessage = "Error updating review in database: ";
      dbReview.reviewText = reqBody.review.reviewText;
      dbReview.rating = reqBody.review.rating;
      dbReview.save();
    } else {
      // else add a new review to collection
      errorProgressMessage = "Error adding review to collection: ";
      await Review.create({
        userRef: userID,
        bookID: bookID,
        reviewText: reqBody.review.reviewText,
        rating: reqBody.review.rating,
      });
    }

    return Response.json(
      {
        message: `review for book ${params.bookID} added successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
