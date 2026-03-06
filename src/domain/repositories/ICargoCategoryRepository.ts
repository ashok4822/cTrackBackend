import { CargoCategory } from "../entities/CargoCategory";

export interface ICargoCategoryRepository {
    findAll(): Promise<CargoCategory[]>;
    findById(id: string): Promise<CargoCategory | null>;
    save(category: CargoCategory): Promise<CargoCategory>;
    update(id: string, category: Partial<CargoCategory>): Promise<CargoCategory | null>;
}
