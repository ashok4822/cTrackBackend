"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContainerRequest = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const RequestMapper_1 = require("../mappers/RequestMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateContainerRequest {
    containerRequestRepository;
    userRepository;
    notificationService;
    eventBus;
    constructor(containerRequestRepository, userRepository, notificationService, eventBus) {
        this.containerRequestRepository = containerRequestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.eventBus = eventBus;
    }
    async execute(requestData, userContext) {
        const customerId = requestData.customerId || userContext?.userId || "";
        // Validation: Prevent duplicate destuffing requests for the same container
        if (requestData.type === "destuffing" && requestData.containerId) {
            const activeRequests = await this.containerRequestRepository.findActiveRequestsByCustomerId(customerId);
            const hasExistingRequest = activeRequests.some((r) => r.type === "destuffing" && r.containerId === requestData.containerId);
            if (hasExistingRequest) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.DUPLICATE_DESTUFF_REQUEST, HttpStatus_1.HttpStatus.CONFLICT);
            }
        }
        const request = RequestMapper_1.RequestMapper.toEntity({ ...requestData, preferredDate: requestData.preferredDate ? new Date(requestData.preferredDate) : undefined }, customerId);
        const savedRequest = await this.containerRequestRepository.create(request);
        // Audit Log (Event-driven)
        if (userContext) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage_1.ResponseMessage.AUDIT_REQUEST_CREATED,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_REQUEST,
                resourceId: savedRequest.id,
                details: {
                    type: savedRequest.type,
                    containerNumber: savedRequest.containerNumber,
                },
                ipAddress: userContext.ipAddress,
            });
        }
        // Notify Operators
        try {
            const operators = await this.userRepository.findByRole("operator");
            const notificationData = {
                type: "info",
                title: ResponseMessage_1.ResponseMessage.NEW_CONTAINER_REQUEST_TITLE,
                message: `${ResponseMessage_1.ResponseMessage.NEW_CONTAINER_REQUEST_MESSAGE} (Type: ${requestData.type})`,
                link: "/operator/cargo-requests",
            };
            for (const operator of operators) {
                if (operator.id) {
                    await this.notificationService.send(operator.id, notificationData);
                }
            }
        }
        catch (error) {
            console.error("Failed to send operator notifications:", error);
        }
        return RequestMapper_1.RequestMapper.toResponseDto(savedRequest);
    }
}
exports.CreateContainerRequest = CreateContainerRequest;
//# sourceMappingURL=CreateContainerRequest.js.map