import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";
import { ICreateCargoCategory } from "../ports/ICreateCargoCategory";
import { CreateCargoCategoryRequestDto, CargoCategoryResponseDto } from "../dto/CargoDto";
import { CargoMapper } from "../mappers/CargoMapper";

export class CreateCargoCategory implements ICreateCargoCategory {
    constructor(private repository: ICargoCategoryRepository) { }

    async execute(data: CreateCargoCategoryRequestDto): Promise<CargoCategoryResponseDto> {
        const category = CargoMapper.toEntity(data);
        const saved = await this.repository.save(category);
        return CargoMapper.toResponseDto(saved);
    }
}
