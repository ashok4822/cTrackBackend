/**
 * Seed Demo Users Script
 *
 * Creates 3 demo accounts for exploring the cTrack application:
 *   - Admin:    admin@demo.com    / Admin@123
 *   - Operator: operator@demo.com / Operator@123
 *   - Customer: customer@demo.com / Customer@123
 *
 * Usage:
 *   cd server
 *   npx ts-node scripts/seedDemoUsers.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

// Load env from server root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ctracklocal";

const demoUsers = [
  {
    email: "admin@demo.com",
    password: "Admin@123",
    role: "admin",
    name: "Demo Admin",
    isBlocked: false,
  },
  {
    email: "operator@demo.com",
    password: "Operator@123",
    role: "operator",
    name: "Demo Operator",
    isBlocked: false,
  },
  {
    email: "customer@demo.com",
    password: "Customer@123",
    role: "customer",
    name: "Demo Customer",
    isBlocked: false,
  },
];

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "operator", "customer"], required: true },
    name: { type: String },
    phone: { type: String },
    googleId: { type: String, sparse: true, unique: true },
    profileImage: { type: String },
    companyName: { type: String },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

async function seed() {
  console.log("🌱 Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  for (const demo of demoUsers) {
    const existing = await UserModel.findOne({ email: demo.email });

    if (existing) {
      // Update password in case it changed
      const hashedPassword = await bcrypt.hash(demo.password, 10);
      await UserModel.updateOne(
        { email: demo.email },
        { $set: { password: hashedPassword, isBlocked: false, name: demo.name } }
      );
      console.log(`🔄 Updated existing demo user: ${demo.email} (${demo.role})`);
    } else {
      const hashedPassword = await bcrypt.hash(demo.password, 10);
      await UserModel.create({
        email: demo.email,
        password: hashedPassword,
        role: demo.role,
        name: demo.name,
        isBlocked: false,
      });
      console.log(`✅ Created demo user: ${demo.email} (${demo.role})`);
    }
  }

  console.log("\n🎉 Demo users seeded successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Role      | Email                | Password     ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin     | admin@demo.com        | Admin@123    ");
  console.log("  Operator  | operator@demo.com     | Operator@123 ");
  console.log("  Customer  | customer@demo.com     | Customer@123 ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
