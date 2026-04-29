import { ContainerCollectionResponseDto, ContainerFiltersDto } from "../dto/ContainerDto";

export interface IGetAllContainers {
    execute(filters?: ContainerFiltersDto): Promise<ContainerCollectionResponseDto>;
}
