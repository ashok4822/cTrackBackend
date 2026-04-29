"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContainer = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const ContainerMapper_1 = require("../mappers/ContainerMapper");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateContainer {
    containerRepository;
    eventBus;
    constructor(containerRepository, eventBus) {
        this.containerRepository = containerRepository;
        this.eventBus = eventBus;
    }
    async execute(data, userContext) {
        const container = ContainerMapper_1.ContainerMapper.toEntity(data);
        const savedContainer = await this.containerRepository.save(container);
        // Audit Log (Event-driven)
        if (userContext) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage_1.ResponseMessage.AUDIT_CONTAINER_CREATED,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_CONTAINER,
                resourceId: savedContainer.id,
                details: { containerNumber: savedContainer.containerNumber, status: savedContainer.status },
                ipAddress: userContext.ipAddress
            });
        }
        // Emit for downstream side-effects (Sockets, etc.)
        this.eventBus.emit(IEventBus_1.DomainEvents.CONTAINER_CREATED, {
            container: savedContainer,
            inputData: data
        });
    }
}
exports.CreateContainer = CreateContainer;
//# sourceMappingURL=CreateContainer.js.map