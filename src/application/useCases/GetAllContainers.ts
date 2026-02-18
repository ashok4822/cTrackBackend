import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";

export class GetAllContainers {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(filters?: {
        containerNumber?: string;
        size?: string;
        type?: string;
        block?: string;
        status?: string;
    }): Promise<Container[]> {
        return await this.containerRepository.findAll(filters);
    }
}
