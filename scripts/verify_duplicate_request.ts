import mongoose from "mongoose";
import dotenv from "dotenv";
import { ContainerRepository } from "../src/infrastructure/repositories/ContainerRepository";
import { ContainerRequestRepository } from "../src/infrastructure/repositories/ContainerRequestRepository";
import { GetCustomerContainers } from "../src/application/useCases/GetCustomerContainers";
import { CreateContainerRequest } from "../src/application/useCases/CreateContainerRequest";
import { ContainerModel } from "../src/infrastructure/models/ContainerModel";
import { ContainerRequestModel } from "../src/infrastructure/models/ContainerRequestModel";

dotenv.config();

async function verify() {
    try {
        const mongoUri = process.env.MONGODB_LOCAL || "mongodb://localhost:27017/ctracklocal";
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB: ${mongoUri}`);

        const customerName = "Test Customer " + Date.now();
        const userId = new mongoose.Types.ObjectId().toString();

        // 1. Create a dummy container
        const container = await ContainerModel.create({
            containerNumber: "TEST" + Math.floor(Math.random() * 1000000),
            size: "20ft",
            type: "standard",
            status: "in-yard",
            shippingLine: "TEST LINE",
            customer: customerName,
            empty: false
        });
        console.log(`Created test container: ${container.containerNumber} (ID: ${container._id})`);

        const containerRepo = new ContainerRepository();
        const requestRepo = new ContainerRequestRepository();
        const getCustomerContainers = new GetCustomerContainers(containerRepo, requestRepo);
        const createRequest = new CreateContainerRequest(requestRepo);

        // 2. Initial check: container should be returned
        let containers = await getCustomerContainers.execute(customerName, userId);
        console.log(`Initial container count: ${containers.length}`);
        const foundInitial = containers.some(c => c.id === container._id.toString());
        if (!foundInitial) throw new Error("Container not found in initial fetch");

        // 3. Create an active request for this container
        console.log("Creating destuffing request...");
        await createRequest.execute({
            customerId: userId,
            type: "destuffing",
            containerId: container._id.toString(),
            containerNumber: container.containerNumber,
            preferredDate: new Date().toISOString(),
            remarks: "Test request"
        });

        // 4. Second check: container should NOT be returned
        containers = await getCustomerContainers.execute(customerName, userId);
        console.log(`Container count after request: ${containers.length}`);
        const foundAfter = containers.some(c => c.id === container._id.toString());
        if (foundAfter) throw new Error("Container STILL found after request was created!");
        console.log("SUCCESS: Container filtered out correctly.");

        // 5. Duplicate request check: should throw error
        console.log("Attempting duplicate request...");
        try {
            await createRequest.execute({
                customerId: userId,
                type: "destuffing",
                containerId: container._id.toString(),
                containerNumber: container.containerNumber,
                preferredDate: new Date().toISOString(),
                remarks: "Duplicate request"
            });
            throw new Error("Duplicate request should have failed but succeeded!");
        } catch (error: any) {
            if (error.message === "An active destuffing request already exists for this container.") {
                console.log("SUCCESS: Duplicate request blocked with expected message.");
            } else {
                throw error;
            }
        }

        // Cleanup
        await ContainerModel.findByIdAndDelete(container._id);
        await ContainerRequestModel.deleteMany({ containerId: container._id });
        console.log("Cleanup complete.");

        console.log("\nVERIFICATION COMPLETED SUCCESSFULLY");
        process.exit(0);
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verify();
