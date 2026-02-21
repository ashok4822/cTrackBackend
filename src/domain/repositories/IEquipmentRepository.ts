import { Equipment } from "../entities/Equipment";

export interface IEquipmentRepository {
    findAll(filters?: {
        type?: string;
        status?: string;
        name?: string;
    }): Promise<Equipment[]>;
    findById(id: string): Promise<Equipment | null>;
    save(equipment: Equipment): Promise<Equipment>;
    delete(id: string): Promise<void>;
}
