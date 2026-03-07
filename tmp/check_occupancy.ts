import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ctrack';

async function checkOccupancy() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const BlockSchema = new mongoose.Schema({
            name: String,
            occupied: Number,
            capacity: Number
        });
        const Block = mongoose.model('Block', BlockSchema);

        const ContainerSchema = new mongoose.Schema({
            yardLocation: {
                block: String
            },
            status: String
        });
        const Container = mongoose.model('Container', ContainerSchema);

        const blocks = await Block.find();
        console.log('\n--- Blocks in Database ---');
        for (const block of blocks) {
            const containerCount = await Container.countDocuments({
                'yardLocation.block': block.name,
                status: { $in: ['gate-in', 'in-yard', 'damaged'] } // Statuses that contribute to occupancy
            });
            console.log(`Block: ${block.name} | Database Occupied: ${block.occupied} | Actual Container Count: ${containerCount}`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkOccupancy();
