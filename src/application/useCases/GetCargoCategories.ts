import { CargoCategory } from "../../domain/entities/CargoCategory";
import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";

export class GetCargoCategories {
    constructor(private repository: ICargoCategoryRepository) { }

    async execute(): Promise<CargoCategory[]> {
        return await this.repository.findAll();
    }
}
