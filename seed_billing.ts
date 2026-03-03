import mongoose from "mongoose";
import dotenv from "dotenv";
import { ActivityModel } from "./src/infrastructure/models/ActivityModel";
import { ChargeModel } from "./src/infrastructure/models/ChargeModel";

dotenv.config();

const activities = [
  {
    code: "LIFT",
    name: "Container Lift",
    description: "Lifting container on/off truck",
    category: "handling",
    unitType: "per-container",
    active: true,
  },
  {
    code: "STOR",
    name: "Yard Storage",
    description: "Daily storage charge in yard",
    category: "storage",
    unitType: "per-day",
    active: true,
  },
  {
    code: "STUF",
    name: "Stuffing",
    description: "Container stuffing at factory",
    category: "stuffing",
    unitType: "per-container",
    active: true,
  },
  {
    code: "DEST",
    name: "Destuffing",
    description: "Container destuffing at factory",
    category: "stuffing",
    unitType: "per-container",
    active: true,
  },
  {
    code: "WIGH",
    name: "Weighing",
    description: "Container weighing service",
    category: "handling",
    unitType: "per-container",
    active: true,
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_LOCAL || "mongodb://localhost:27017/ctracklocal";
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);

    // Clear existing (optional)
    // await ActivityModel.deleteMany({});
    // await ChargeModel.deleteMany({});

    for (const act of activities) {
      let activity = await ActivityModel.findOne({ code: act.code });
      if (!activity) {
        activity = await ActivityModel.create(act);
        console.log(`Created activity: ${act.code}`);
      } else {
        console.log(`Activity already exists: ${act.code}`);
      }

      // Ensure charges exist for this activity
      const activityId = (activity._id as any).toString();

      const existing20 = await ChargeModel.findOne({ activityId: activityId, containerSize: "20ft" } as any);
      if (!existing20) {
        await ChargeModel.create({
          activityId: activityId,
          containerSize: "20ft",
          containerType: "all",
          rate: 2000,
          currency: "INR",
          active: true,
        } as any);
        console.log(`Added 20ft charge for ${act.code}`);
      }

      const existing40 = await ChargeModel.findOne({ activityId: activityId, containerSize: "40ft" } as any);
      if (!existing40) {
        await ChargeModel.create({
          activityId: activityId,
          containerSize: "40ft",
          containerType: "all",
          rate: 3500,
          currency: "INR",
          active: true,
        } as any);
        console.log(`Added 40ft charge for ${act.code}`);
      }
    }

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
}

seed();
