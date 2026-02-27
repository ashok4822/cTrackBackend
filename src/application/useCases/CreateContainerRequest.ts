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
            new Date(),
            new Date()
        );

        return await this.containerRequestRepository.create(request);
    }
}
