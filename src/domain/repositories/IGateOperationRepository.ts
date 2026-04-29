import { GateOperation } from "../entities/GateOperation";

export interface GateOperationFilter {
    type?: "gate-in" | "gate-out";
    containerNumber?: string | string[];
    vehicleNumber?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface DailyMovement {
    day: string;
    type: "gate-in" | "gate-out";
    count: number;
}

export interface IGateOperationRepository {
    findAll(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
    }): Promise<GateOperation[]>;
    findById(id: string): Promise<GateOperation | null>;
    save(operation: GateOperation): Promise<GateOperation>;
    count(filter: GateOperationFilter): Promise<number>;
    getDailyMovements(filter: GateOperationFilter): Promise<DailyMovement[]>;
}
