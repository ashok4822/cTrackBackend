import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";
import { IUpdateCargoCategory } from "../ports/IUpdateCargoCategory";
import { UpdateCargoCategoryRequestDto, CargoCategoryResponseDto } from "../dto/CargoDto";
import { CargoMapper } from "../mappers/CargoMapper";

export class UpdateCargoCategory implements IUpdateCargoCategory {
    constructor(private readonly _cargoCategoryRepository: ICargoCategoryRepository) { }

    async execute(id: string, data: UpdateCargoCategoryRequestDto): Promise<CargoCategoryResponseDto | null> {
        const updated = await this._cargoCategoryRepository.update(id, data);
        return updated ? CargoMapper.toResponseDto(updated) : null;
    }
}
