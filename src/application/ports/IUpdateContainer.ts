import { UpdateContainerRequestDto } from "../dto/ContainerDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IUpdateContainer {
    execute(request: UpdateContainerRequestDto, userContext?: UserContextDto): Promise<void>;
}
