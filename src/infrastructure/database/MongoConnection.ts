import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "");
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occured";
    console.error(`Error: ${message}`);
    process.exit(1);
  }
};
