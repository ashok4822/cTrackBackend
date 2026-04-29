import { GateOperationCollectionResponseDto } from "../dto/GateDto";

export interface IGetGateOperations {
    execute(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
        status?: string;
    }): Promise<GateOperationCollectionResponseDto>;
}
