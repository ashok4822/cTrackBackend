import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";
import { IGetCargoCategories } from "../ports/IGetCargoCategories";
import { CargoCategoryCollectionResponseDto } from "../dto/CargoDto";
import { CargoMapper } from "../mappers/CargoMapper";

export class GetCargoCategories implements IGetCargoCategories {
    constructor(private repository: ICargoCategoryRepository) { }

    async execute(): Promise<CargoCategoryCollectionResponseDto> {
        const categories = await this.repository.findAll();
        return CargoMapper.toCollectionResponseDto(categories);
    }
}
