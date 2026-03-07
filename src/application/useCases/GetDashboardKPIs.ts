import { ContainerModel } from "../../infrastructure/models/ContainerModel";
import { GateOperationModel } from "../../infrastructure/models/GateOperationModel";
import { BlockModel } from "../../infrastructure/models/BlockModel";

export class GetDashboardKPIs {
    async execute() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [
            totalContainersInYard,
            containersInTransit,
            gateInToday,
            gateOutToday,
            blocks
        ] = await Promise.all([
            ContainerModel.countDocuments({ status: { $in: ["gate-in", "in-yard"] } }),
            ContainerModel.countDocuments({ status: "in-transit" }),
            GateOperationModel.countDocuments({ type: "gate-in", timestamp: { $gte: startOfDay } }),
            GateOperationModel.countDocuments({ type: "gate-out", timestamp: { $gte: startOfDay } }),
            BlockModel.find({})
        ]);

        const totalCapacity = blocks.reduce((sum, block) => sum + block.capacity, 0);
        const totalOccupied = blocks.reduce((sum, block) => sum + block.occupied, 0);
        const yardUtilization = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

        return {
            totalContainersInYard,
            containersInTransit,
            gateInToday,
            gateOutToday,
            yardUtilization,
        };
    }
}
