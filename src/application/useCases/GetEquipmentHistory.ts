import { IGetEquipmentHistory } from "../ports/IGetEquipmentHistory";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistoryCollectionResponseDto } from "../dto/EquipmentDto";
import { EquipmentMapper } from "../mappers/EquipmentMapper";

export class GetEquipmentHistory implements IGetEquipmentHistory {
    constructor(private readonly _historyRepository: IEquipmentHistoryRepository) { }

    async execute(equipmentId: string): Promise<EquipmentHistoryCollectionResponseDto> {
        const historyList = await this._historyRepository.findByEquipmentId(equipmentId);
        return EquipmentMapper.toHistoryCollectionResponseDto(historyList);
    }
}
