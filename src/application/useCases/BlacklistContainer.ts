import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { Container } from "../../domain/entities/Container";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

export class BlacklistContainer {
    constructor(
        private containerRepository: IContainerRepository,
        private historyRepository: IContainerHistoryRepository,
        private auditLogRepository?: IAuditLogRepository
    ) { }

    async execute(id: string, userContext?: UserContext): Promise<void> {
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
            container.customerName,
            container.yardLocation,
            container.gateInTime,
            container.gateOutTime,
            container.dwellTime,
            container.weight,
            container.cargoWeight,
            (container as any).cargoDescription,
            (container as any).hazardousClassification,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            true, // blacklisted
            container.cargoCategory,
            container.createdAt,
            container.updatedAt
        );

        await this.containerRepository.save(updatedContainer);

        await this.historyRepository.save(new ContainerHistory(
            null,
            id,
            "Blacklisted",
            "Container has been blacklisted",
            userContext?.userName || "Admin"
        ));

        // Audit Log
        if (this.auditLogRepository && userContext) {
            await this.auditLogRepository.save(new AuditLog(
                null,
                userContext.userId,
                userContext.userRole,
                userContext.userName,
                "CONTAINER_BLACKLISTED",
                "Container",
                id,
                JSON.stringify({ containerNumber: updatedContainer.containerNumber }),
                userContext.ipAddress
            ));
        }
    }
}
