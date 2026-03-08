import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { socketService } from "../../infrastructure/services/socketService";
import { NotificationModel } from "../../infrastructure/models/NotificationModel";

export class CreateContainerRequest {
    constructor(
        private containerRequestRepository: IContainerRequestRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(requestData: {
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
    }): Promise<ContainerRequest> {
        // Validation: Prevent duplicate destuffing requests for the same container
        if (requestData.type === "destuffing" && requestData.containerId) {
            const activeRequests = await this.containerRequestRepository.findActiveRequestsByCustomerId(requestData.customerId);
            const hasExistingRequest = activeRequests.some(
                r => r.type === "destuffing" && r.containerId === requestData.containerId
            );

            if (hasExistingRequest) {
                throw new Error("An active destuffing request already exists for this container.");
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
            requestData.preferredDate ? new Date(requestData.preferredDate) : undefined,
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
                    remarks: `Initial ${requestData.type} request submitted`
                }
            ], // checkpoints
            undefined, // cargoCharge (calculated during allocation)
            new Date(),
            new Date()
        );

        const savedRequest = await this.containerRequestRepository.create(request);

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
                    // Save to DB
                    const newNotification = await NotificationModel.create({
                        userId: operator.id,
                        ...notificationData,
                    });

                    // Emit via Socket
                    socketService.emitNotification({
                        ...notificationData,
                        id: newNotification._id.toString(),
                        read: false,
                        timestamp: new Date(),
                    }, operator.id);
                }
            }
        } catch (error) {
            console.error("Failed to send operator notifications:", error);
        }

        return savedRequest;
    }
}
