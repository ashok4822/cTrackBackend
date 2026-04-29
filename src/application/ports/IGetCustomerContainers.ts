import { ContainerResponseDto } from "../dto/ContainerDto";

export interface IGetCustomerContainers {
    execute(customerName: string, customerId: string): Promise<ContainerResponseDto[]>;
}
