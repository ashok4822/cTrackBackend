import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { ICreateContainer } from "../ports/ICreateContainer";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { CreateContainerRequestDto } from "../dto/ContainerDto";
import { UserContextDto } from "../dto/CommonDto";
import { ContainerMapper } from "../mappers/ContainerMapper";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateContainer implements ICreateContainer {
    constructor(
        private readonly _containerRepository: IContainerRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(data: CreateContainerRequestDto, userContext?: UserContextDto): Promise<void> {
        const container = ContainerMapper.toEntity(data);
        const savedContainer = await this._containerRepository.save(container);

        // Audit Log (Event-driven)
        if (userContext) {
            this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage.AUDIT_CONTAINER_CREATED,
                resourceType: ResponseMessage.RESOURCE_CONTAINER,
                resourceId: savedContainer.id,
                details: { containerNumber: savedContainer.containerNumber, status: savedContainer.status },
                ipAddress: userContext.ipAddress
            });
        }

        // Emit for downstream side-effects (Sockets, etc.)
        this._eventBus.emit(DomainEvents.CONTAINER_CREATED, {
            container: savedContainer,
            inputData: data
        });
    }
}
