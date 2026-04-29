import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import type { ContainerFilter } from "../../domain/repositories/IContainerRepository";
import { IGetAllContainers } from "../ports/IGetAllContainers";
import { ContainerCollectionResponseDto, ContainerFiltersDto } from "../dto/ContainerDto";
import { ContainerMapper } from "../mappers/ContainerMapper";

export class GetAllContainers implements IGetAllContainers {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(filters?: ContainerFiltersDto): Promise<ContainerCollectionResponseDto> {
        // ContainerFiltersDto is structurally compatible with ContainerFilter
        const containers = await this.containerRepository.findAll(filters as ContainerFilter | undefined);
        return ContainerMapper.toCollectionResponseDto(containers);
    }
}
