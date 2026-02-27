import { ContainerRequest } from "../entities/ContainerRequest";

export interface IContainerRequestRepository {
    create(request: ContainerRequest): Promise<ContainerRequest>;
    findByCustomerId(customerId: string): Promise<any[]>;
    findById(id: string): Promise<ContainerRequest | null>;
    findAll(): Promise<any[]>;
    update(id: string, data: Partial<ContainerRequest>): Promise<ContainerRequest | null>;
    updateStatus(id: string, status: string): Promise<ContainerRequest | null>;
}
