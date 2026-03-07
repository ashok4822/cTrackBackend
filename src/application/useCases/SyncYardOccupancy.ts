import { BlockModel } from "../../infrastructure/models/BlockModel";
import { ContainerModel } from "../../infrastructure/models/ContainerModel";

export class SyncYardOccupancy {
    async execute(): Promise<{ message: string; results: any[] }> {
        const blocks = await BlockModel.find();
        const results = [];

        for (const block of blocks) {
            // Count containers that are currently in this block with relevant statuses
            const containerCount = await ContainerModel.countDocuments({
                'yardLocation.block': block.name,
                status: { $in: ['gate-in', 'in-yard', 'damaged'] }
            });

            const oldOccupied = block.occupied;
            block.occupied = containerCount;
            await block.save();

            results.push({
                block: block.name,
                oldOccupied,
                newOccupied: containerCount
            });
        }

        return {
            message: "Yard occupancy synchronized successfully",
            results
        };
    }
}
