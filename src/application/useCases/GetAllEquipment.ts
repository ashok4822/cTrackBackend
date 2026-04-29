import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { IGetAllEquipment } from "../ports/IGetAllEquipment";
import { EquipmentCollectionResponseDto, EquipmentFiltersDto } from "../dto/EquipmentDto";
import { EquipmentMapper } from "../mappers/EquipmentMapper";

export class GetAllEquipment implements IGetAllEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(filters?: EquipmentFiltersDto): Promise<EquipmentCollectionResponseDto> {
        const equipmentList = await this.equipmentRepository.findAll(filters);
        return EquipmentMapper.toCollectionResponseDto(equipmentList);
    }
}
