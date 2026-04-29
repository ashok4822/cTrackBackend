import { UpdateContainerRequestDto, ContainerRequestResponseDto } from "../dto/RequestDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IUpdateContainerRequest {
    execute(
        id: string, 
        data: UpdateContainerRequestDto, 
        userContext?: UserContextDto
    ): Promise<ContainerRequestResponseDto | null>;
}
