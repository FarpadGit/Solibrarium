import { Schema, model, models } from "mongoose";

// 7 days
const RememberMeExpirationInSeconds = 7*24*60*60;

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
  createdAt: { 
    type: Date, 
    expires: RememberMeExpirationInSeconds, 
    default: Date.now()
   }
});

RememberMeSchema.index({ createdAt: 1 },{ expireAfterSeconds: RememberMeExpirationInSeconds });

const RememberMe = models.RememberMe || model("RememberMe", RememberMeSchema);

export default RememberMe;
