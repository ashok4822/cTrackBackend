"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerHistoryMapper = void 0;
class ContainerHistoryMapper {
    static toResponseDto(entity) {
        const containerId = typeof entity.containerId === "string"
            ? entity.containerId
            : entity.containerId.id;
        const containerNumber = typeof entity.containerId === "string"
            ? undefined
            : entity.containerId.containerNumber;
        return {
            id: entity.id,
            containerId,
            containerNumber,
            activity: entity.activity,
            details: entity.details,
            performedBy: entity.performedBy,
            timestamp: entity.timestamp,
        };
    }
    static toCollectionResponseDto(entities) {
        return {
            items: entities.map((e) => this.toResponseDto(e)),
            total: entities.length,
        };
    }
}
exports.ContainerHistoryMapper = ContainerHistoryMapper;
//# sourceMappingURL=ContainerHistoryMapper.js.map