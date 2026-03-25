import { ContainerRequest } from "../entities/ContainerRequest";

export type ContainerRequestFilter = {
    customerId?: string;
    type?: "stuffing" | "destuffing";
    status?: string | string[] | { $in: string[] };
    containerNumber?: string;
    [key: string]: unknown;
};

export interface IContainerRequestRepository {
    create(request: ContainerRequest): Promise<ContainerRequest>;
    findByCustomerId(customerId: string): Promise<ContainerRequest[]>;
    findById(id: string): Promise<ContainerRequest | null>;
    findAll(): Promise<ContainerRequest[]>;
    update(id: string, data: Partial<ContainerRequest>): Promise<ContainerRequest | null>;
    updateStatus(id: string, status: string): Promise<ContainerRequest | null>;
    findByContainerNumber(containerNumber: string): Promise<ContainerRequest | null>;
    findActiveRequestsByCustomerId(customerId: string): Promise<ContainerRequest[]>;
    countPending(filter: ContainerRequestFilter): Promise<number>;
    findRecent(filter: ContainerRequestFilter, limit: number): Promise<ContainerRequest[]>;
}
