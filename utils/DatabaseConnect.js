import mongoose from "mongoose";
import dns from "node:dns/promises";

let isConnected = false; // track the connection

export const connectToDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  // for some reason MongoDB Atlas SRV connection string fails without an explicit DNS server
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "Solibrarium",
      });
    isConnected = true;
    console.log("MongoDB connected");
      
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};

