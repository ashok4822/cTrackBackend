import { GateOperation } from "../entities/GateOperation";

export interface GateOperationFilters {
    type?: "gate-in" | "gate-out";
    containerNumber?: string;
    status?: string;
}

export interface IGateOperationRepository {
    save(operation: GateOperation): Promise<void>;
    findAll(filter?: GateOperationFilters): Promise<GateOperation[]>;
    findById(id: string): Promise<GateOperation | null>;
}
