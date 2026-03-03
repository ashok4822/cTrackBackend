import mongoose from "mongoose";
import dotenv from "dotenv";
import { ActivityModel } from "./src/infrastructure/models/ActivityModel";
import { ChargeModel } from "./src/infrastructure/models/ChargeModel";

dotenv.config();

async function check() {
    try {
        const mongoUri = process.env.MONGODB_LOCAL || "mongodb://localhost:27017/ctracklocal";
        await mongoose.connect(mongoUri);

        const activityCount = await ActivityModel.countDocuments();
        const chargeCount = await ChargeModel.countDocuments();

        console.log(`Activities: ${activityCount}`);
        console.log(`Charges: ${chargeCount}`);

        if (chargeCount > 0) {
            const sampleCharge = await ChargeModel.findOne().populate('activityId');
            console.log('Sample Charge:', JSON.stringify(sampleCharge, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
