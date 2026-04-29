import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IGetContainerRequestById } from "../ports/IGetContainerRequestById";
import { ContainerRequestResponseDto } from "../dto/RequestDto";
import { RequestMapper } from "../mappers/RequestMapper";

export class GetContainerRequestById implements IGetContainerRequestById {
    constructor(private containerRequestRepository: IContainerRequestRepository) { }

    async execute(id: string): Promise<ContainerRequestResponseDto | null> {
        const request = await this.containerRequestRepository.findById(id);
        return request ? RequestMapper.toResponseDto(request) : null;
    }
}
