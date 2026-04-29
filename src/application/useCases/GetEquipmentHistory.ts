import { IGetEquipmentHistory } from "../ports/IGetEquipmentHistory";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistoryCollectionResponseDto } from "../dto/EquipmentDto";
import { EquipmentMapper } from "../mappers/EquipmentMapper";

export class GetEquipmentHistory implements IGetEquipmentHistory {
    constructor(private historyRepository: IEquipmentHistoryRepository) { }

    async execute(equipmentId: string): Promise<EquipmentHistoryCollectionResponseDto> {
        const historyList = await this.historyRepository.findByEquipmentId(equipmentId);
        return EquipmentMapper.toHistoryCollectionResponseDto(historyList);
    }
}
