"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeMapper = void 0;
const Charge_1 = require("../../domain/entities/Charge");
class ChargeMapper {
    static toEntity(dto) {
        return new Charge_1.Charge(null, dto.activityId, undefined, // activityName filled by repo/usecase
        dto.containerSize, dto.containerType, dto.rate, dto.currency, dto.effectiveFrom || new Date(), true, // active by default
        dto.cargoCategoryId);
    }
    static toResponseDto(entity) {
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
    static toCollectionResponseDto(entities) {
        return {
            items: entities.map((e) => this.toResponseDto(e)),
            total: entities.length,
        };
    }
    static toHistoryResponseDto(history) {
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
    static toHistoryCollectionResponseDto(history) {
        return {
            items: history.map((h) => this.toHistoryResponseDto(h)),
            total: history.length,
        };
    }
}
exports.ChargeMapper = ChargeMapper;
//# sourceMappingURL=ChargeMapper.js.map