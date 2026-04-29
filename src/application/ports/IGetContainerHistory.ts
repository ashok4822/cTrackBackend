import { ContainerHistoryCollectionResponseDto } from "../dto/ContainerDto";

export interface IGetContainerHistory {
    execute(containerId: string): Promise<ContainerHistoryCollectionResponseDto>;
}
