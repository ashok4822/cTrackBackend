import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IGetContainerById } from "../ports/IGetContainerById";
import { ContainerResponseDto } from "../dto/ContainerDto";
import { ContainerMapper } from "../mappers/ContainerMapper";

export class GetContainerById implements IGetContainerById {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(id: string): Promise<ContainerResponseDto | null> {
        const container = await this.containerRepository.findById(id);
        return container ? ContainerMapper.toResponseDto(container) : null;
    }
}
