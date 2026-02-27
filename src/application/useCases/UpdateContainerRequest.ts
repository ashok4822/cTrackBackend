import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";

export class UpdateContainerRequest {
    constructor(private repository: IContainerRequestRepository) { }

    async execute(id: string, data: Partial<ContainerRequest>): Promise<ContainerRequest | null> {
        return await this.repository.update(id, data);
    }
}
