import { Container } from "../../domain/entities/Container";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";

export class GetCustomerContainers {
    constructor(
        private containerRepository: IContainerRepository,
        private containerRequestRepository: IContainerRequestRepository
    ) { }

    async execute(customerName: string, customerId: string): Promise<Container[]> {
        // Efficiently fetch only this customer's containers
        const containers = await this.containerRepository.findAll({
            customer: customerName,
            status: ["pending", "gate-in", "in-yard", "in-transit", "at-port", "at-factory", "damaged"]
        });

        // Fetch active requests for this customer
        const activeRequests = await this.containerRequestRepository.findActiveRequestsByCustomerId(customerId);

        // Filter out containers that already have an active destuffing request
        const containersWithActiveRequests = new Set(
            activeRequests
                .filter(r => r.type === "destuffing" && r.containerId)
                .map(r => r.containerId as string)
        );

        return containers.filter(c => c.id && !containersWithActiveRequests.has(c.id));
    }
}
