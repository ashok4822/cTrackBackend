"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YardMapper = void 0;
const Block_1 = require("../../domain/entities/Block");
class YardMapper {
    static toEntity(dto) {
        return new Block_1.Block("", // id will be generated
        dto.name, dto.capacity, 0 // occupied starts at 0
        );
    }
    /** Apply a partial update to an existing Block entity */
    static applyUpdate(existing, data) {
        return new Block_1.Block(existing.id, data.name !== undefined ? data.name : existing.name, data.capacity !== undefined ? data.capacity : existing.capacity, data.occupied !== undefined ? data.occupied : existing.occupied);
    }
    static toResponseDto(block) {
        return {
            id: block.id,
            name: block.name,
            capacity: block.capacity,
            occupied: block.occupied,
            createdAt: block.createdAt,
            updatedAt: block.updatedAt,
        };
    }
    static toCollectionResponseDto(blocks) {
        return {
            items: blocks.map(b => this.toResponseDto(b)),
            total: blocks.length,
        };
    }
    static toSyncResponseDto(message, results) {
        return { message, results };
    }
}
exports.YardMapper = YardMapper;
//# sourceMappingURL=YardMapper.js.map