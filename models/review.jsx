import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  userRef: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review author is required!"],
  },
  bookID: {
    type: Schema.Types.ObjectId,
    required: [true, "BookID is required!"],
  },
  reviewText: String,
  rating: Number,
});

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
