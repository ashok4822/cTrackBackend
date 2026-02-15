import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";

export class GetAllContainers {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(): Promise<Container[]> {
        return await this.containerRepository.findAll();
    }
}
