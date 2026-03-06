import { CargoCategory } from "../../domain/entities/CargoCategory";
import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";

export class UpdateCargoCategory {
    constructor(private cargoCategoryRepository: ICargoCategoryRepository) { }

    async execute(id: string, data: Partial<CargoCategory>): Promise<CargoCategory | null> {
        return await this.cargoCategoryRepository.update(id, data);
    }
}
