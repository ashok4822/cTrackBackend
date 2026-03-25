import { GateOperation } from "../entities/GateOperation";

export interface GateOperationFilter {
    type?: "gate-in" | "gate-out";
    containerNumber?: string | { $in: string[] };
    vehicleNumber?: string | { $regex: string; $options: string };
    timestamp?: {
        $gte?: Date;
        $lte?: Date;
    };
    [key: string]: unknown;
}

export interface DailyMovement {
    _id: {
        day: string;
        type: "gate-in" | "gate-out";
    };
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
    countDocuments(filter: GateOperationFilter): Promise<number>;
    getDailyMovements(filter: GateOperationFilter): Promise<DailyMovement[]>;
}
