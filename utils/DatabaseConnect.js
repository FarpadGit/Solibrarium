import mongoose from "mongoose";

let isConnected = false; // track the connection

export const connectToDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "Solibrarium",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    isConnected = true;
    console.log("MongoDB connected");
      
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};
