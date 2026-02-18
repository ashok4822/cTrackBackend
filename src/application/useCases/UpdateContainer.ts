import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";

export class UpdateContainer {
    constructor(
        private containerRepository: IContainerRepository,
        private historyRepository: IContainerHistoryRepository
    ) { }

    async execute(id: string, data: Partial<Container>): Promise<void> {
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new Error("Container not found");
        }

        const updatedContainer = new Container(
            container.id,
            data.containerNumber !== undefined ? data.containerNumber : container.containerNumber,
            data.size !== undefined ? (data.size as any) : container.size,
            data.type !== undefined ? (data.type as any) : container.type,
            data.status !== undefined ? (data.status as any) : container.status,
            data.shippingLine !== undefined ? data.shippingLine : container.shippingLine,
            data.empty !== undefined ? data.empty : container.empty,
            data.movementType !== undefined ? (data.movementType as any) : container.movementType,
            data.customer !== undefined ? data.customer : container.customer,
            data.yardLocation !== undefined ? data.yardLocation : container.yardLocation,
            data.gateInTime !== undefined ? data.gateInTime : container.gateInTime,
            data.gateOutTime !== undefined ? data.gateOutTime : container.gateOutTime,
            data.dwellTime !== undefined ? data.dwellTime : container.dwellTime,
            data.weight !== undefined ? data.weight : container.weight,
            data.cargoWeight !== undefined ? data.cargoWeight : container.cargoWeight,
            data.sealNumber !== undefined ? data.sealNumber : container.sealNumber,
            data.damaged !== undefined ? data.damaged : container.damaged,
            data.damageDetails !== undefined ? data.damageDetails : container.damageDetails,
            data.blacklisted !== undefined ? data.blacklisted : container.blacklisted,
            container.createdAt,
            container.updatedAt
        );

        await this.containerRepository.save(updatedContainer);

        // Log history for important changes
        if (data.status && data.status !== container.status) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Status Changed",
                `Status updated from ${container.status} to ${data.status}`,
                "Admin"
            ));
        }

        if (data.yardLocation && data.yardLocation.block !== container.yardLocation?.block) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Location Updated",
                `Location updated from ${container.yardLocation?.block || "None"} to ${data.yardLocation.block}`,
                "Admin"
            ));
        }

        if (data.gateInTime && (!container.gateInTime || new Date(data.gateInTime).getTime() !== new Date(container.gateInTime).getTime())) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Gate In",
                `Container gated in at ${new Date(data.gateInTime).toLocaleString()}`,
                "Admin"
            ));
        }

        if (data.gateOutTime && (!container.gateOutTime || new Date(data.gateOutTime).getTime() !== new Date(container.gateOutTime).getTime())) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Gate Out",
                `Container gated out at ${new Date(data.gateOutTime).toLocaleString()}`,
                "Admin"
            ));
        }

        if (data.damaged !== undefined && data.damaged !== container.damaged) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Damage Status Updated",
                `Damage status changed to ${data.damaged ? "Damaged" : "Undamaged"}`,
                "Admin"
            ));
        }

        if (data.damageDetails !== undefined && data.damageDetails !== container.damageDetails) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Damage Details Updated",
                `Damage details updated: ${data.damageDetails || "Cleared"}`,
                "Admin"
            ));
        }

        if (data.weight !== undefined && data.weight !== container.weight) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Weight Updated",
                `Weight updated from ${container.weight || "None"} to ${data.weight} kg`,
                "Admin"
            ));
        }

        if (data.cargoWeight !== undefined && data.cargoWeight !== container.cargoWeight) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Cargo Weight Updated",
                `Cargo weight updated from ${container.cargoWeight || "None"} to ${data.cargoWeight} kg`,
                "Admin"
            ));
        }

        if (data.sealNumber !== undefined && data.sealNumber !== container.sealNumber) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Seal Number Updated",
                `Seal number changed from ${container.sealNumber || "None"} to ${data.sealNumber}`,
                "Admin"
            ));
        }

        if (data.shippingLine !== undefined && data.shippingLine !== container.shippingLine) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Shipping Line Updated",
                `Shipping line changed from ${container.shippingLine} to ${data.shippingLine}`,
                "Admin"
            ));
        }

        if (data.customer !== undefined && data.customer !== container.customer) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Customer Updated",
                `Customer changed from ${container.customer || "None"} to ${data.customer}`,
                "Admin"
            ));
        }

        if (data.size !== undefined && data.size !== container.size) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Size Updated",
                `Container size changed from ${container.size} to ${data.size}`,
                "Admin"
            ));
        }

        if (data.type !== undefined && data.type !== container.type) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Type Updated",
                `Container type changed from ${container.type} to ${data.type}`,
                "Admin"
            ));
        }

        if (data.movementType !== undefined && data.movementType !== container.movementType) {
            await this.historyRepository.save(new ContainerHistory(
                null,
                id,
                "Movement Type Updated",
                `Movement type changed from ${container.movementType || "None"} to ${data.movementType}`,
                "Admin"
            ));
        }
    }
}
