import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { IUpdateContainer } from "../ports/IUpdateContainer";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UpdateContainerRequestDto } from "../dto/ContainerDto";
import { UserContextDto } from "../dto/CommonDto";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateContainer implements IUpdateContainer {
    constructor(
        private readonly _containerRepository: IContainerRepository,
        private readonly _equipmentRepository: IEquipmentRepository,
        private readonly _blockRepository: IBlockRepository,
        private readonly _eventBus: IEventBus,
    ) { }


    async execute(request: UpdateContainerRequestDto, userContext?: UserContextDto): Promise<void> {
        const { id, equipmentName, performedBy = "System", ...data } = request;
        
        const container = await this._containerRepository.findById(id);
        if (!container) {
            throw new AppError(ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // 1. Yard Assignment Validation (Guard)
        if (data.yardLocation && data.yardLocation.block !== container.yardLocation?.block) {
            const allowedStatuses = ["gate-in", "in-yard", "damaged"];
            if (!allowedStatuses.includes(container.status)) {
                throw new AppError(ResponseMessage.CONTAINER_OUTSIDE_TERMINAL, HttpStatus.BAD_REQUEST);
            }

            if (data.yardLocation.block) {
                const newBlock = await this._blockRepository.findByName(data.yardLocation.block);
                if (!newBlock) {
                    throw new AppError(ResponseMessage.BLOCK_NOT_FOUND, HttpStatus.NOT_FOUND);
                }
                if (newBlock.occupied >= newBlock.capacity) {
                    throw new AppError(ResponseMessage.BLOCK_FULL, HttpStatus.BAD_REQUEST);
                }
            }
        }

        // 2. Perform Primary State Update
        const updatedContainer = container.update(data);

        await this._containerRepository.save(updatedContainer);

        // Domain side-effects
        this._eventBus.emit(DomainEvents.CONTAINER_UPDATED, {
            oldContainer: container,
            newContainer: updatedContainer,
            performedBy,
            equipmentName,
            userContext // pass userContext for audit logging in the handler if needed, or keep audit log here
        });

        // Audit Log (Keep here as it's a primary responsibility of the Use Case to log what happened)
        if (userContext) {
            this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage.AUDIT_CONTAINER_UPDATED,
                resourceType: ResponseMessage.RESOURCE_CONTAINER,
                resourceId: updatedContainer.id,
                details: { containerNumber: updatedContainer.containerNumber },
                ipAddress: userContext.ipAddress
            });
        }
    }
}

