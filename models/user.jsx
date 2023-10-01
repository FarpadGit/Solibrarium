import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    match: [
      /(?=.*[a-z])(?=.*[A-Z])/,
      "Username password, it should contain uppercase and lowercase letters!",
    ],
  },
  books: {
    type: [
      {
        id: String,
        title: String,
        author: String,
        publisher: String,
        publishedDate: String,
        price: Number,
        image: String,
      },
    ],
    required: false,
  },
  loyaltyPoints: { type: Number, default: 0 },
});

UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "userRef",
});

const User = models.User || model("User", UserSchema);

export default User;
