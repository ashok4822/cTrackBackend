import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { GateOperation } from "../../domain/entities/GateOperation";

export class GetGateOperations {
    constructor(private gateOperationRepository: IGateOperationRepository) { }

    async execute(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
        status?: string;
    }): Promise<GateOperation[]> {
        return await this.gateOperationRepository.findAll(filters);
    }
}
