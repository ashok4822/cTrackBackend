import { IContainerRepository } from "../../domain/repositories/IContainerRepository";

import { UserContextDto } from "../dto/CommonDto";
import { IBlacklistContainer } from "../ports/IBlacklistContainer";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class BlacklistContainer implements IBlacklistContainer {
    constructor(
        private containerRepository: IContainerRepository,
        private eventBus: IEventBus
    ) { }


    async execute(id: string, userContext?: UserContextDto): Promise<void> {
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new AppError(ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updatedContainer = container.update({ blacklisted: true });

        await this.containerRepository.save(updatedContainer);

        this.eventBus.emit(DomainEvents.CONTAINER_HISTORY_CREATED, {
            containerId: id,
            action: ResponseMessage.ACTION_BLACKLISTED,
            details: ResponseMessage.DETAILS_BLACKLISTED,
            performedBy: userContext?.userName || "Admin"
        });

        // Audit Log (Event-driven)
        if (userContext) {
            this.eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage.AUDIT_BLACKLISTED,
                resourceType: ResponseMessage.RESOURCE_CONTAINER,
                resourceId: id,
                details: { containerNumber: updatedContainer.containerNumber },
                ipAddress: userContext.ipAddress
            });
        }
    }
}

