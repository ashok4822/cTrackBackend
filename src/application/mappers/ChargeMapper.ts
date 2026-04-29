import { Charge } from "../../domain/entities/Charge";
import { ChargeHistory } from "../../domain/entities/ChargeHistory";
import { 
  ChargeResponseDto, 
  ChargeCollectionResponseDto,
  CreateChargeRequestDto,
  ChargeHistoryResponseDto,
  ChargeHistoryCollectionResponseDto
} from "../dto/ChargeDto";

export class ChargeMapper {
  static toEntity(dto: CreateChargeRequestDto): Charge {
    return new Charge(
      null,
      dto.activityId,
      undefined, // activityName filled by repo/usecase
      dto.containerSize,
      dto.containerType,
      dto.rate,
      dto.currency,
      dto.effectiveFrom || new Date(),
      true, // active by default
      dto.cargoCategoryId
    );
  }

  static toResponseDto(entity: Charge): ChargeResponseDto {
    return {
      id: entity.id,
      activityId: entity.activityId,
      activityName: entity.activityName || "Unknown",
      containerSize: entity.containerSize,
      containerType: entity.containerType,
      rate: entity.rate,
      currency: entity.currency,
      effectiveFrom: entity.effectiveFrom,
      effectiveTo: entity.effectiveTo,
      active: entity.active,
      cargoCategoryId: entity.cargoCategoryId,
      cargoCategoryName: entity.cargoCategoryName,
    };
  }

  static toCollectionResponseDto(entities: Charge[]): ChargeCollectionResponseDto {
    return {
      items: entities.map((e) => this.toResponseDto(e)),
      total: entities.length,
    };
  }

  static toHistoryResponseDto(history: ChargeHistory): ChargeHistoryResponseDto {
    return {
      id: history.id || null,
      chargeId: history.chargeId,
      activityName: history.activityName,
      containerSize: history.containerSize,
      containerType: history.containerType,
      oldRate: history.oldRate,
      newRate: history.newRate,
      currency: history.currency,
      changedAt: history.changedAt,
    };
  }

  static toHistoryCollectionResponseDto(history: ChargeHistory[]): ChargeHistoryCollectionResponseDto {
    return {
      items: history.map((h) => this.toHistoryResponseDto(h)),
      total: history.length,
    };
  }
}
