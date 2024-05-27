import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env");
}

const MONGODB_URI: string = process.env.MONGODB_URI;

export const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Cached Connection");
      return mongoose.connection.asPromise();
    }
    console.log("Connected to mongodb");
    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    throw error;
  }
};
