import mongoose from "mongoose";
import dotenv from "dotenv";
import { ActivityRepository } from "./src/infrastructure/repositories/ActivityRepository";
import { ChargeRepository } from "./src/infrastructure/repositories/ChargeRepository";

dotenv.config();

async function test() {
    try {
        const mongoUri = process.env.MONGODB_LOCAL || "mongodb://localhost:27017/ctracklocal";
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB: ${mongoUri}`);

        const activityRepo = new ActivityRepository();
        const chargeRepo = new ChargeRepository();

        console.log("Fetching activities...");
        const activities = await activityRepo.findAll();
        console.log("Found activities:", activities.length);

        console.log("Fetching charges...");
        const charges = await chargeRepo.findAll();
        console.log("Found charges:", charges.length);

        console.log("Test completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Test failed", error);
        process.exit(1);
    }
}

test();
