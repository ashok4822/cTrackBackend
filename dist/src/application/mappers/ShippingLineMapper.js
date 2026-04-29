"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingLineMapper = void 0;
const ShippingLine_1 = require("../../domain/entities/ShippingLine");
class ShippingLineMapper {
    static toEntity(dto) {
        return new ShippingLine_1.ShippingLine(null, dto.name, dto.code || "");
    }
    /** Apply an update to an existing ShippingLine entity */
    static applyUpdate(existing, data) {
        return new ShippingLine_1.ShippingLine(existing.id, data.name !== undefined ? data.name : existing.shipping_line_name, data.code !== undefined ? data.code : existing.shipping_line_code);
    }
    static toResponseDto(entity) {
        return {
            id: entity.id || "",
            name: entity.shipping_line_name,
            code: entity.shipping_line_code,
        };
    }
    static toCollectionResponseDto(entities) {
        return {
            items: entities.map(e => this.toResponseDto(e)),
            total: entities.length,
        };
    }
}
exports.ShippingLineMapper = ShippingLineMapper;
//# sourceMappingURL=ShippingLineMapper.js.map