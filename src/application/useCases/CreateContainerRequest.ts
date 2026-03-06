import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";

export class CreateContainerRequest {
    constructor(private containerRequestRepository: IContainerRequestRepository) { }

    async execute(requestData: {
        customerId: string;
        type: "stuffing" | "destuffing";
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
            new Date(),
            new Date()
        );

        return await this.containerRequestRepository.create(request);
    }
}
