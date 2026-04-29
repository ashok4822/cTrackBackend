"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContainerRequest = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const RequestMapper_1 = require("../mappers/RequestMapper");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateContainerRequest {
    repository;
    eventBus;
    billingService;
    containerRepository;
    billRepository;
    notificationService;
    constructor(repository, eventBus, billingService, containerRepository, billRepository, notificationService) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.billingService = billingService;
        this.containerRepository = containerRepository;
        this.billRepository = billRepository;
        this.notificationService = notificationService;
    }
    async execute(id, data, userContext) {
        const existingRequest = await this.repository.findById(id);
        if (!existingRequest)
            return null;
        // 1. Update Checkpoints via Mapper
        const currentCheckpoints = RequestMapper_1.RequestMapper.updateCheckpoints(existingRequest, data);
        Object.assign(data, { checkpoints: currentCheckpoints });
        // 2. Persist primary update
        const { equipmentId, ...updatePayload } = data;
        const updatedRequest = await this.repository.update(id, updatePayload);
        if (!updatedRequest)
            return null;
        // 3. Side Effects: Audit Logging
        if (userContext) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage_1.ResponseMessage.AUDIT_REQUEST_UPDATED,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_REQUEST,
                resourceId: updatedRequest.id,
                details: {
                    status: updatedRequest.status,
                    containerNumber: updatedRequest.containerNumber,
                },
                ipAddress: userContext.ipAddress,
            });
        }
        // 4. Side Effects: Notifications
        if (data.status && data.status !== existingRequest.status && this.notificationService) {
            await this.notificationService.send(updatedRequest.customerId, {
                type: data.status === "rejected" ? "alert" : "success",
                title: ResponseMessage_1.ResponseMessage.REQUEST_STATUS_UPDATED_TITLE,
                message: `Your ${updatedRequest.type} request status has been updated to ${data.status}.`,
                link: "/customer/requests",
            });
        }
        // 5. Side Effects: Container Ownership & Billing
        if (updatedRequest && existingRequest && existingRequest.status !== "approved" && data.status === "approved") {
            await this.handleApprovalSideEffects(updatedRequest, existingRequest, data);
        }
        // 6. Side Effects: Billing on Dispatch
        const activeBillingStatuses = ["approved", "in-transit", "ready-for-dispatch"];
        const isEnteringBillingPhase = !activeBillingStatuses.includes(existingRequest.status) &&
            activeBillingStatuses.includes(data.status);
        if (isEnteringBillingPhase) {
            await this.handleDispatchSideEffects(updatedRequest, data);
        }
        return RequestMapper_1.RequestMapper.toResponseDto(updatedRequest);
    }
    async handleApprovalSideEffects(updatedRequest, existingRequest, data) {
        if (!this.containerRepository || !(data.containerId || updatedRequest.containerId))
            return;
        try {
            const containerId = data.containerId || updatedRequest.containerId;
            const container = await this.containerRepository.findById(containerId);
            if (container && container.customer !== existingRequest.customerId) {
                // 1. Assign container to customer
                const newContainer = container.update({ customer: existingRequest.customerId });
                await this.containerRepository.save(newContainer);
                // 2. Transfer pending bills
                if (this.billRepository) {
                    const bills = await this.billRepository.findByContainerId(containerId);
                    const pendingBills = bills.filter((b) => b.status === "pending");
                    for (const bill of pendingBills) {
                        const updatedBill = bill.update({ customer: existingRequest.customerId });
                        await this.billRepository.save(updatedBill);
                    }
                }
            }
        }
        catch (error) {
            console.error("Failed to process approval side-effects:", error);
        }
    }
    async handleDispatchSideEffects(updatedRequest, data) {
        try {
            if (data.equipmentId) {
                this.eventBus.emit(IEventBus_1.DomainEvents.EQUIPMENT_HISTORY_CREATED, {
                    equipmentId: data.equipmentId,
                    action: `${updatedRequest.type === "stuffing" ? ResponseMessage_1.ResponseMessage.ACTION_STUFFING_DISPATCH : ResponseMessage_1.ResponseMessage.ACTION_DESTUFFING_DISPATCH}`,
                    details: `Container: ${updatedRequest.containerNumber || "N/A"}`,
                    performedBy: "Operator",
                });
            }
            const billIdentifier = `REQ-${updatedRequest.id}`;
            // In a real app, the repository should probably check this, but we'll use our new service
            await this.billingService.generateBillForRequest(updatedRequest, billIdentifier);
        }
        catch (error) {
            console.error("Failed to process dispatch side-effects:", error);
        }
    }
}
exports.UpdateContainerRequest = UpdateContainerRequest;
//# sourceMappingURL=UpdateContainerRequest.js.map