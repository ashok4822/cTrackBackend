import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { INotificationService } from "../services/INotificationService";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

export class CreateContainerRequest {
  constructor(
    private containerRequestRepository: IContainerRequestRepository,
    private userRepository: IUserRepository,
    private notificationService: INotificationService,
    private auditLogRepository?: IAuditLogRepository,
  ) {}

  async execute(
    requestData: {
      customerId: string;
      type: "stuffing" | "destuffing";
      cargoCategoryId?: string;
      containerSize?: string;
      containerType?: string;
      cargoDescription?: string;
      cargoWeight?: number;
      preferredDate?: string;
      specialInstructions?: string;
      isHazardous?: boolean;
      hazardClass?: string;
      unNumber?: string;
      packingGroup?: string;
      containerId?: string;
      containerNumber?: string;
      remarks?: string;
    },
    userContext?: {
      userId: string;
      userName: string;
      userRole: string;
      ipAddress: string;
    },
  ): Promise<ContainerRequest> {
    // Validation: Prevent duplicate destuffing requests for the same container
    if (requestData.type === "destuffing" && requestData.containerId) {
      const activeRequests =
        await this.containerRequestRepository.findActiveRequestsByCustomerId(
          requestData.customerId,
        );
      const hasExistingRequest = activeRequests.some(
        (r) =>
          r.type === "destuffing" && r.containerId === requestData.containerId,
      );

      if (hasExistingRequest) {
        throw new Error(
          "An active destuffing request already exists for this container.",
        );
      }
    }

    const request = new ContainerRequest(
      null,
      requestData.customerId,
      requestData.type,
      "pending",
      requestData.cargoCategoryId,
      undefined, // cargoCategoryName (optional, usually set on fetch)
      requestData.containerSize,
      requestData.containerType,
      requestData.cargoDescription,
      requestData.cargoWeight,
      requestData.preferredDate
        ? new Date(requestData.preferredDate)
        : undefined,
      requestData.specialInstructions || requestData.remarks,
      requestData.isHazardous,
      requestData.hazardClass,
      requestData.unNumber,
      requestData.packingGroup,
      requestData.containerId,
      requestData.containerNumber,
      requestData.remarks,
      [
        {
          location: "Customer Portal",
          timestamp: new Date(),
          status: "pending",
          remarks: `Initial ${requestData.type} request submitted`,
        },
      ], // checkpoints
      undefined, // cargoCharge (calculated during allocation)
      new Date(),
      new Date(),
    );

    const savedRequest = await this.containerRequestRepository.create(request);

    // Audit Log
    if (this.auditLogRepository && userContext) {
      await this.auditLogRepository.save(
        new AuditLog(
          null,
          userContext.userId,
          userContext.userRole,
          userContext.userName,
          "REQUEST_CREATED",
          "Request",
          savedRequest.id,
          JSON.stringify({
            type: savedRequest.type,
            containerNumber: savedRequest.containerNumber,
          }),
          userContext.ipAddress,
        ),
      );
    }

    // Notify Operators
    try {
      const operators = await this.userRepository.findByRole("operator");
      const notificationData = {
        type: "info" as const,
        title: "New Container Request",
        message: `A new ${requestData.type} request has been submitted by a customer.`,
        link: "/operator/cargo-requests",
      };

      for (const operator of operators) {
        if (operator.id) {
          await this.notificationService.send(operator.id, notificationData);
        }
      }
    } catch (error) {
      console.error("Failed to send operator notifications:", error);
    }

    return savedRequest;
  }
}
