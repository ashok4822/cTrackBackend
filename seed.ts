import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// import { UserModel } from "./src/infrastructure/models/UserModel";
import { UserModel } from "./src/infrastructure/models/UserModel";

dotenv.config();

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_LOCAL || process.env.MONGODB_URI || "";
    console.log(`Using URI: ${uri.substring(0, 20)}...`);
    await mongoose.connect(uri);

    const email = "admin@ctrack.com";
    const existingAdmin = await UserModel.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await UserModel.create({
      email,
      password: hashedPassword,
      role: "admin",
      name: "Super Admin",
    });

    console.log("Default admin created: admin@ctrack.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
