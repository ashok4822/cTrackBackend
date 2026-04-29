import { ContainerRequestCollectionResponseDto } from "../dto/RequestDto";

export interface IGetAllContainerRequests {
    execute(): Promise<ContainerRequestCollectionResponseDto>;
}
