import { ContainerRequestCollectionResponseDto } from "../dto/RequestDto";

export interface IGetCustomerRequests {
    execute(customerId: string): Promise<ContainerRequestCollectionResponseDto>;
}
