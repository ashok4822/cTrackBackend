import { GateOperation } from "../entities/GateOperation";

export interface IGateOperationRepository {
    findAll(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
    }): Promise<GateOperation[]>;
    findById(id: string): Promise<GateOperation | null>;
    save(operation: GateOperation): Promise<GateOperation>;
}
