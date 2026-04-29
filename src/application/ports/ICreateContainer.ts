import { CreateContainerRequestDto } from "../dto/ContainerDto";
import { UserContextDto } from "../dto/CommonDto";

export interface ICreateContainer {
    execute(data: CreateContainerRequestDto, userContext?: UserContextDto): Promise<void>;
}
