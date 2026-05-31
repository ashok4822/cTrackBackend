import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IGetContainerRequestById } from "../ports/IGetContainerRequestById";
import { ContainerRequestResponseDto } from "../dto/RequestDto";
import { RequestMapper } from "../mappers/RequestMapper";

export class GetContainerRequestById implements IGetContainerRequestById {
    constructor(private readonly _containerRequestRepository: IContainerRequestRepository) { }

    async execute(id: string): Promise<ContainerRequestResponseDto | null> {
        const request = await this._containerRequestRepository.findById(id);
        return request ? RequestMapper.toResponseDto(request) : null;
    }
}
