
import mongoose from 'mongoose';
import { ContainerModel } from './infrastructure/models/ContainerModel';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkContainer() {
    const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ctrack';
    await mongoose.connect(mongodbUri);

    const container = await ContainerModel.findOne({ containerNumber: 'MSCU7891594' });
    if (!container) {
        console.log("Container MSCU7891594 not found");
    } else {
        console.log("Container MSCU7891594 Data:");
        console.log("Status:", container.status);
        console.log("Gate-In Time:", container.gateInTime);
        console.log("Gate-Out Time:", container.gateOutTime);
        console.log("Current Server Time:", new Date());

        if (container.gateInTime) {
            const outTime = container.gateOutTime ? new Date(container.gateOutTime) : new Date();
            const inTime = new Date(container.gateInTime);
            const diffMs = outTime.getTime() - inTime.getTime();
            const dwellDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            console.log("Calculated diffMs:", diffMs);
            console.log("Calculated dwellDays (current logic):", dwellDays);
        }
    }

    await mongoose.disconnect();
}

checkContainer().catch(console.error);
