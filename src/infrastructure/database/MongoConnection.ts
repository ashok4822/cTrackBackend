import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occured";
    console.error(`Error: ${message}`);
    process.exit(1);
  }
};
