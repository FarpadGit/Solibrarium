import { Schema, model, models } from "mongoose";

const RememberMeSchema = new Schema({
  userRef: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Token user is required!"],
  },
  tokenKey: {
    type: String,
    required: [true, "Token key is required!"],
    unique: [true, "Token key already exists!"],
  },
  tokenValue: {
    type: String,
    required: [true, "Token value is required!"],
  },
});

const RememberMe = models.RememberMe || model("RememberMe", RememberMeSchema);

export default RememberMe;
