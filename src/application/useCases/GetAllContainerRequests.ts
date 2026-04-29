import { IGetAllContainerRequests } from "../ports/IGetAllContainerRequests";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { ContainerRequestCollectionResponseDto } from "../dto/RequestDto";
import { RequestMapper } from "../mappers/RequestMapper";

export class GetAllContainerRequests implements IGetAllContainerRequests {
    constructor(private repository: IContainerRequestRepository) { }

    async execute(): Promise<ContainerRequestCollectionResponseDto> {
        const requests = await this.repository.findAll();
        return RequestMapper.toCollectionResponseDto(requests);
    }
}
