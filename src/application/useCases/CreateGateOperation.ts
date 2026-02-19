import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { GateOperation } from "../../domain/entities/GateOperation";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { Container } from "../../domain/entities/Container";

export class CreateGateOperation {
    constructor(
        private gateOperationRepository: IGateOperationRepository,
        private containerRepository: IContainerRepository,
        private historyRepository: IContainerHistoryRepository
    ) { }

    async execute(data: {
        type: "gate-in" | "gate-out";
        containerNumber: string;
        vehicleNumber: string;
        driverName: string;
        purpose: "port" | "factory" | "transfer";
        remarks?: string;
        approvedBy?: string;
    }): Promise<void> {
        // 1. Find the container by number
        const containers = await this.containerRepository.findAll({ containerNumber: data.containerNumber });
        const container = containers.find(c => c.containerNumber === data.containerNumber);

        if (!container) {
            throw new Error(`Container ${data.containerNumber} not found`);
        }

        // 2. Create the gate operation record
        const gateOperation = new GateOperation(
            null,
            data.type,
            data.containerNumber,
            data.vehicleNumber,
            data.driverName,
            data.purpose,
            "completed", // Automatically completed for now, or could depend on flow
            new Date(),
            data.approvedBy,
            data.remarks
        );

        await this.gateOperationRepository.save(gateOperation);

        // 3. Update container status and timestamps
        const newStatus = data.type === "gate-in" ? "gate-in" : "gate-out";
        const gateInTime = data.type === "gate-in" ? new Date() : container.gateInTime;
        const gateOutTime = data.type === "gate-out" ? new Date() : container.gateOutTime;

        const updatedContainer = new Container(
            container.id,
            container.containerNumber,
            container.size,
            container.type,
            newStatus,
            container.shippingLine,
            container.empty,
            container.movementType,
            container.customer,
            container.yardLocation,
            gateInTime,
            gateOutTime,
            container.dwellTime,
            container.weight,
            container.cargoWeight,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            container.blacklisted,
            container.createdAt,
            container.updatedAt
        );

        await this.containerRepository.save(updatedContainer);

        // 4. Log history
        if (container.id) {
            const history = new ContainerHistory(
                null,
                container.id,
                data.type === "gate-in" ? "Gate In" : "Gate Out",
                `Container ${data.type.replace("-", " ")} via vehicle ${data.vehicleNumber}. Purpose: ${data.purpose}`,
                data.approvedBy || "Admin"
            );
            await this.historyRepository.save(history);
        }
    }
}
