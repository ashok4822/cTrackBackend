import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";

export class CreateContainer {
    constructor(
        private containerRepository: IContainerRepository,
        private historyRepository: IContainerHistoryRepository
    ) { }

    async execute(data: {
        containerNumber: string;
        size: "20ft" | "40ft";
        type: "standard" | "reefer" | "tank" | "open-top";
        status: "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged";
        shippingLine: string;
        movementType?: "import" | "export" | "domestic";
        customer?: string;
        weight?: number;
        sealNumber?: string;
    }): Promise<void> {
        const container = new Container(
            null,
            data.containerNumber,
            data.size,
            data.type,
            data.status,
            data.shippingLine,
            undefined, // empty
            data.movementType,
            data.customer,
            undefined, // yardLocation
            undefined, // gateInTime
            undefined, // gateOutTime
            undefined, // dwellTime
            data.weight,
            undefined, // cargoWeight
            data.sealNumber
        );
        const savedContainer = await this.containerRepository.save(container);

        if (savedContainer.id) {
            const history = new ContainerHistory(
                null,
                savedContainer.id,
                "Container Created",
                `Container created with status: ${savedContainer.status}`,
                "Admin" // Generic for now, can be updated later if user info is available
            );
            await this.historyRepository.save(history);
        }
    }
}
