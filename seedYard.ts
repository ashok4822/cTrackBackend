import mongoose from "mongoose";
import dotenv from "dotenv";
import { YardBlockModel } from "./src/infrastructure/models/YardBlockModel";

dotenv.config();

const yardBlocks = [
    { name: "Block A", capacity: 100, occupied: 45 },
    { name: "Block B", capacity: 150, occupied: 120 },
    { name: "Block C", capacity: 80, occupied: 30 },
    { name: "Block D", capacity: 120, occupied: 90 },
    { name: "Block E", capacity: 200, occupied: 50 },
    { name: "Block F", capacity: 60, occupied: 55 },
];

const seedYard = async () => {
    try {
        const uri = process.env.MONGODB_LOCAL || process.env.MONGODB_URI || "";
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(uri);

        console.log("Clearing existing yard blocks...");
        await YardBlockModel.deleteMany({});

        console.log("Seeding yard blocks...");
        await YardBlockModel.insertMany(yardBlocks);

        console.log("Yard blocks seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding yard blocks:", error);
        process.exit(1);
    }
};

seedYard();
