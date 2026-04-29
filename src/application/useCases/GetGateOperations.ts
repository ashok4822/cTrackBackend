import { IGetGateOperations } from "../ports/IGetGateOperations";
import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { GateOperationCollectionResponseDto } from "../dto/GateDto";
import { GateMapper } from "../mappers/GateMapper";

export class GetGateOperations implements IGetGateOperations {
    constructor(private gateOperationRepository: IGateOperationRepository) { }

    async execute(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
        status?: string;
    }): Promise<GateOperationCollectionResponseDto> {
        const operations = await this.gateOperationRepository.findAll(filters);
        return GateMapper.toCollectionResponseDto(operations);
    }
}
