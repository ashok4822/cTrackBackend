import { Equipment } from "../../domain/entities/Equipment";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";
import { 
  CreateEquipmentRequestDto,
  UpdateEquipmentRequestDto,
  EquipmentResponseDto, 
  EquipmentCollectionResponseDto,
  EquipmentHistoryResponseDto,
  EquipmentHistoryCollectionResponseDto
} from "../dto/EquipmentDto";

export class EquipmentMapper {
  static toEntity(dto: CreateEquipmentRequestDto): Equipment {
    return new Equipment(
      null,
      dto.name,
      dto.type,
      dto.status,
      dto.operator,
      dto.lastMaintenance,
      dto.nextMaintenance
    );
  }

  /** Apply an update to an existing Equipment entity */
  static applyUpdate(existing: Equipment, data: UpdateEquipmentRequestDto): Equipment {
    return new Equipment(
      existing.id,
      data.name ?? existing.name,
      data.type ?? existing.type,
      data.status ?? existing.status,
      data.operator ?? existing.operator,
      data.lastMaintenance ?? existing.lastMaintenance,
      data.nextMaintenance ?? existing.nextMaintenance
    );
  }

  static toResponseDto(equipment: Equipment): EquipmentResponseDto {
    return {
      id: equipment.id,
      name: equipment.name,
      type: equipment.type,
      status: equipment.status,
      operator: equipment.operator,
      lastMaintenance: equipment.lastMaintenance,
      nextMaintenance: equipment.nextMaintenance,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt,
    };
  }

  static toCollectionResponseDto(equipmentList: Equipment[]): EquipmentCollectionResponseDto {
    return {
      items: equipmentList.map(e => this.toResponseDto(e)),
      total: equipmentList.length,
    };
  }

  static toHistoryResponseDto(history: EquipmentHistory): EquipmentHistoryResponseDto {
    return {
      id: history.id,
      equipmentId: history.equipmentId,
      activity: history.activity,
      details: history.details ?? null,
      performedBy: history.performedBy ?? null,
      timestamp: history.timestamp ?? null,
    };
  }

  static toHistoryCollectionResponseDto(historyList: EquipmentHistory[]): EquipmentHistoryCollectionResponseDto {
    return {
      items: historyList.map(h => this.toHistoryResponseDto(h)),
      total: historyList.length,
    };
  }

  static toSummaryDto(equipment: Equipment) {
    return {
      id: equipment.id,
      name: equipment.name,
      type: equipment.type,
      status: equipment.status,
    };
  }
}
