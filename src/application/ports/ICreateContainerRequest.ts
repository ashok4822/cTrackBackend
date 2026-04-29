import { CreateContainerRequestDto, ContainerRequestResponseDto } from "../dto/RequestDto";
import { UserContextDto } from "../dto/CommonDto";

export interface ICreateContainerRequest {
    execute(
        requestData: CreateContainerRequestDto, 
        userContext?: UserContextDto
    ): Promise<ContainerRequestResponseDto>;
}
