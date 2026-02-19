import { Equipment } from "../entities/Equipment";

export interface EquipmentFilters {
    type?: "reach-stacker" | "forklift" | "crane" | "straddle-carrier";
    status?: "operational" | "maintenance" | "down";
    name?: string;
}

export interface IEquipmentRepository {
    save(equipment: Equipment): Promise<void>;
    findAll(filter?: EquipmentFilters): Promise<Equipment[]>;
    findById(id: string): Promise<Equipment | null>;
    delete(id: string): Promise<void>;
}
