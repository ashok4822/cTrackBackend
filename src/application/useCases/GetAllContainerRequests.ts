import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";

export class GetAllContainerRequests {
    constructor(private repository: IContainerRequestRepository) { }

    async execute(): Promise<ContainerRequest[]> {
        return await this.repository.findAll();
    }
}
