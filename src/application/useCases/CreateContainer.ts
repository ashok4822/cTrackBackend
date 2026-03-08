import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

export class CreateContainer {
    constructor(
        private containerRepository: IContainerRepository,
        private historyRepository: IContainerHistoryRepository,
        private auditLogRepository?: IAuditLogRepository
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
    }, userContext?: {
        userId: string;
        userName: string;
        userRole: string;
        ipAddress: string;
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
            undefined, // customerName
            undefined, // yardLocation
            undefined, // gateInTime
            undefined, // gateOutTime
            undefined, // dwellTime
            data.weight,
            undefined, // cargoWeight
            undefined, // cargoDescription
            undefined, // hazardousClassification
            data.sealNumber,
            undefined, // damaged
            undefined, // damageDetails
            undefined, // blacklisted
            undefined, // createdAt
            undefined  // updatedAt
        );
        const savedContainer = await this.containerRepository.save(container);

        // Audit Log
        if (this.auditLogRepository && userContext) {
            await this.auditLogRepository.save(new AuditLog(
                null,
                userContext.userId,
                userContext.userRole,
                userContext.userName,
                "CONTAINER_CREATED",
                "Container",
                savedContainer.id,
                JSON.stringify({ containerNumber: savedContainer.containerNumber, status: savedContainer.status }),
                userContext.ipAddress
            ));
        }

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
