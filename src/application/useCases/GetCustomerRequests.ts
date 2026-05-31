import { IGetCustomerRequests } from "../ports/IGetCustomerRequests";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { ContainerRequestCollectionResponseDto } from "../dto/RequestDto";
import { RequestMapper } from "../mappers/RequestMapper";

export class GetCustomerRequests implements IGetCustomerRequests {
    constructor(private readonly _containerRequestRepository: IContainerRequestRepository) { }

    async execute(customerId: string): Promise<ContainerRequestCollectionResponseDto> {
        const requests = await this._containerRequestRepository.findByCustomerId(customerId);
        return RequestMapper.toCollectionResponseDto(requests);
    }
}
