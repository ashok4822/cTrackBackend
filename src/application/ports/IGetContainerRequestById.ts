import { ContainerRequestResponseDto } from "../dto/RequestDto";

export interface IGetContainerRequestById {
    execute(id: string): Promise<ContainerRequestResponseDto | null>;
}
