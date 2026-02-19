import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { Container } from "../../domain/entities/Container";

export class BlacklistContainer {
    constructor(
        private containerRepository: IContainerRepository,
        private historyRepository: IContainerHistoryRepository
    ) { }

    async execute(id: string): Promise<void> {
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new Error("Container not found");
        }

        const updatedContainer = new Container(
            container.id,
            container.containerNumber,
            container.size,
            container.type,
            container.status,
            container.shippingLine,
            container.empty,
            container.movementType,
            container.customer,
            container.yardLocation,
            container.gateInTime,
            container.gateOutTime,
            container.dwellTime,
            container.weight,
            container.cargoWeight,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            true, // blacklisted
            container.createdAt,
            container.updatedAt
        );

        await this.containerRepository.save(updatedContainer);

        await this.historyRepository.save(new ContainerHistory(
            null,
            id,
            "Blacklisted",
            "Container has been blacklisted",
            "Admin"
        ));
    }
}
