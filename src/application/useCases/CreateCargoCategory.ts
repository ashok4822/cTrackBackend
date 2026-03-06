import { CargoCategory } from "../../domain/entities/CargoCategory";
import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";

export class CreateCargoCategory {
    constructor(private repository: ICargoCategoryRepository) { }

    async execute(data: { name: string, description?: string, chargePerTon?: number }): Promise<CargoCategory> {
        const category = new CargoCategory(null, data.name, data.description, true, data.chargePerTon || 0);
        return await this.repository.save(category);
    }
}
