import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";

export class GetCustomerRequests {
    constructor(private containerRequestRepository: IContainerRequestRepository) { }

    async execute(customerId: string): Promise<ContainerRequest[]> {
        return await this.containerRequestRepository.findByCustomerId(customerId);
    }
}
