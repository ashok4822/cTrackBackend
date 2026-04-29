"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityMapper = void 0;
const Activity_1 = require("../../domain/entities/Activity");
class ActivityMapper {
    static toResponseDto(entity) {
        return {
            id: entity.id,
            code: entity.code,
            name: entity.name,
            description: entity.description,
            category: entity.category,
            unitType: entity.unitType,
            active: entity.active,
        };
    }
    static toCollectionResponseDto(entities) {
        return {
            items: entities.map((e) => this.toResponseDto(e)),
            total: entities.length,
        };
    }
    static toEntity(dto) {
        return new Activity_1.Activity(null, dto.code, dto.name, dto.description, dto.category, dto.unitType, true);
    }
}
exports.ActivityMapper = ActivityMapper;
//# sourceMappingURL=ActivityMapper.js.map