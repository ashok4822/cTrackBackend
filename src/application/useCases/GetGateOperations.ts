import { IGateOperationRepository, GateOperationFilters } from "../../domain/repositories/IGateOperationRepository";
import { GateOperation } from "../../domain/entities/GateOperation";

export class GetGateOperations {
    constructor(private gateOperationRepository: IGateOperationRepository) { }

    async execute(filter?: GateOperationFilters): Promise<GateOperation[]> {
        return await this.gateOperationRepository.findAll(filter);
    }
}
