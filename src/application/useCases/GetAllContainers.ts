import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IGetAllContainers } from "../ports/IGetAllContainers";
import { ContainerCollectionResponseDto, ContainerFiltersDto } from "../dto/ContainerDto";
import { ContainerMapper } from "../mappers/ContainerMapper";

export class GetAllContainers implements IGetAllContainers {
    constructor(private readonly _containerRepository: IContainerRepository) { }

    async execute(filters?: ContainerFiltersDto): Promise<ContainerCollectionResponseDto> {
        const filter = filters ? ContainerMapper.toFilter(filters) : undefined;
        const containers = await this._containerRepository.findAll(filter);
        return ContainerMapper.toCollectionResponseDto(containers);
    }
}
