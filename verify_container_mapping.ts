import mongoose from "mongoose";
import dotenv from "dotenv";
import { ContainerRepository } from "./src/infrastructure/repositories/ContainerRepository";

dotenv.config();

async function testMapping() {
    try {
        const mongoUri = process.env.MONGODB_LOCAL || "mongodb://localhost:27017/ctracklocal";
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB: ${mongoUri}`);

        const containerRepo = new ContainerRepository();

        console.log("Fetching containers...");
        const containers = await containerRepo.findAll();
        console.log("Found containers:", containers.length);

        const containersWithCustomers = containers.filter(c => c.customer);
        console.log(`Containers with customers: ${containersWithCustomers.length}`);

        if (containersWithCustomers.length > 0) {
            console.log("\nMapping Samples:");
            containersWithCustomers.slice(0, 5).forEach(c => {
                console.log(`- Container: ${c.containerNumber}`);
                console.log(`  Customer ID: ${c.customer}`);
                console.log(`  Mapped Name: ${c.customerName || "NOT POPULATED"}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error("Test failed", error);
        process.exit(1);
    }
}

testMapping();
