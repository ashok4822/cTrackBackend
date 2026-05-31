import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { INotificationService } from "../services/INotificationService";
import { IUpdateContainerRequest } from "../ports/IUpdateContainerRequest";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UpdateContainerRequestDto, ContainerRequestResponseDto } from "../dto/RequestDto";
import { UserContextDto } from "../dto/CommonDto";
import { RequestMapper } from "../mappers/RequestMapper";
import { IBillingDomainService } from "../../domain/services/IBillingDomainService";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import type { ContainerRequest } from "../../domain/entities/ContainerRequest";
import type { Bill } from "../../domain/entities/Bill";

export class UpdateContainerRequest implements IUpdateContainerRequest {
  constructor(
    private readonly _repository: IContainerRequestRepository,
    private readonly _eventBus: IEventBus,
    private readonly _billingService: IBillingDomainService,
    private readonly _containerRepository?: IContainerRepository,
    private readonly _billRepository?: IBillRepository,
    private readonly _notificationService?: INotificationService,
  ) {}

  async execute(
    id: string,
    data: UpdateContainerRequestDto,
    userContext?: UserContextDto,
  ): Promise<ContainerRequestResponseDto | null> {
    const existingRequest = await this._repository.findById(id);
    if (!existingRequest) return null;

    // 1. Update Checkpoints via Mapper
    const currentCheckpoints = RequestMapper.updateCheckpoints(existingRequest, data);
    Object.assign(data, { checkpoints: currentCheckpoints });

    // 2. Persist primary update
    const { equipmentId: _equipmentId, ...updatePayload } = data;
    const updatedRequest = await this._repository.update(id, updatePayload);
    if (!updatedRequest) return null;

    // 3. Side Effects: Audit Logging
    if (userContext) {
      this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
        userId: userContext.userId,
        userRole: userContext.userRole,
        userName: userContext.userName,
        action: ResponseMessage.AUDIT_REQUEST_UPDATED,
        resourceType: ResponseMessage.RESOURCE_REQUEST,
        resourceId: updatedRequest.id,
        details: {
          status: updatedRequest.status,
          containerNumber: updatedRequest.containerNumber,
        },
        ipAddress: userContext.ipAddress,
      });
    }

    // 4. Side Effects: Notifications
    if (data.status && data.status !== existingRequest.status && this._notificationService) {
      await this._notificationService.send(updatedRequest.customerId, {
        type: data.status === "rejected" ? "alert" : "success",
        title: ResponseMessage.REQUEST_STATUS_UPDATED_TITLE,
        message: `Your ${updatedRequest.type} request status has been updated to ${data.status}.`,
        link: "/customer/requests",
      });
    }

    // 5. Side Effects: Container Ownership & Billing
    if (updatedRequest && existingRequest && existingRequest.status !== "approved" && data.status === "approved") {
      await this._handleApprovalSideEffects(updatedRequest, existingRequest, data);
    }

    // 6. Side Effects: Billing on Dispatch
    const activeBillingStatuses = ["approved", "in-transit", "ready-for-dispatch"];
    const isEnteringBillingPhase = !activeBillingStatuses.includes(existingRequest.status) && 
                                   activeBillingStatuses.includes(data.status!);
    
    if (isEnteringBillingPhase) {
      await this._handleDispatchSideEffects(updatedRequest, data);
    }

    return RequestMapper.toResponseDto(updatedRequest);
  }

  private async _handleApprovalSideEffects(updatedRequest: ContainerRequest, existingRequest: ContainerRequest, data: UpdateContainerRequestDto) {
    if (!this._containerRepository || !(data.containerId || updatedRequest.containerId)) return;

    try {
      const containerId = data.containerId || updatedRequest.containerId;
      const container = await this._containerRepository.findById(containerId!);
      
      if (container && container.customer !== existingRequest.customerId) {
        // 1. Assign container to customer
        const newContainer = container.update({ customer: existingRequest.customerId });
        await this._containerRepository.save(newContainer);

        // 2. Transfer pending bills
        if (this._billRepository) {
          const bills = await this._billRepository.findByContainerId(containerId!);
          const pendingBills = bills.filter((b: Bill) => b.status === "pending");
          for (const bill of pendingBills) {
            const updatedBill = bill.update({ customer: existingRequest.customerId });
            await this._billRepository.save(updatedBill);
          }
        }
      }
    } catch (error) {
      console.error("Failed to process approval side-effects:", error);
    }
  }

  private async _handleDispatchSideEffects(updatedRequest: ContainerRequest, data: UpdateContainerRequestDto) {
    try {
      if (data.equipmentId) {
        this._eventBus.emit(DomainEvents.EQUIPMENT_HISTORY_CREATED, {
          equipmentId: data.equipmentId,
          action: `${updatedRequest.type === "stuffing" ? ResponseMessage.ACTION_STUFFING_DISPATCH : ResponseMessage.ACTION_DESTUFFING_DISPATCH}`,
          details: `Container: ${updatedRequest.containerNumber || "N/A"}`,
          performedBy: "Operator",
        });
      }

      const billIdentifier = `REQ-${updatedRequest.id}`;
      // In a real app, the repository should probably check this, but we'll use our new service
      await this._billingService.generateBillForRequest(updatedRequest, billIdentifier);
    } catch (error) {
      console.error("Failed to process dispatch side-effects:", error);
    }
  }
}
