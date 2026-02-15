import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";

export class GetContainerById {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(id: string): Promise<Container | null> {
        return await this.containerRepository.findById(id);
    }
}
