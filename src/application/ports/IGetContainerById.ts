import { ContainerResponseDto } from "../dto/ContainerDto";

export interface IGetContainerById {
    execute(id: string): Promise<ContainerResponseDto | null>;
}
