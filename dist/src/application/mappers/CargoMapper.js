"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoMapper = void 0;
const CargoCategory_1 = require("../../domain/entities/CargoCategory");
class CargoMapper {
    static toEntity(dto) {
        return new CargoCategory_1.CargoCategory(null, dto.name, dto.description, true, // active
        dto.chargePerTon);
    }
    static toResponseDto(entity) {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            chargePerTon: entity.chargePerTon,
            active: entity.active,
        };
    }
    static toCollectionResponseDto(entities) {
        return {
            items: entities.map(e => this.toResponseDto(e)),
            total: entities.length,
        };
    }
}
exports.CargoMapper = CargoMapper;
//# sourceMappingURL=CargoMapper.js.map