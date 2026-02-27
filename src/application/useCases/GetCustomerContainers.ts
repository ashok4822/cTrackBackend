import { Container } from "../../domain/entities/Container";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";

export class GetCustomerContainers {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(customerName: string): Promise<Container[]> {
        // We'll need to find containers where customer field matches
        // For now, let's assume the repository has a method for this or we filter after fetching
        const allContainers = await this.containerRepository.findAll();
        return allContainers.filter(c => c.customer === customerName && c.status !== "gate-out");
    }
}
