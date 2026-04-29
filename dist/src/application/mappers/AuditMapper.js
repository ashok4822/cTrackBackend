"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditMapper = void 0;
const AuditLog_1 = require("../../domain/entities/AuditLog");
class AuditMapper {
    static toResponseDto(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            userRole: entity.userRole,
            userName: entity.userName,
            action: entity.action,
            entityType: entity.entityType,
            entityId: entity.entityId,
            details: entity.details,
            ipAddress: entity.ipAddress,
            timestamp: entity.timestamp,
            createdAt: entity.createdAt,
        };
    }
    static toCollectionResponseDto(entities, total, page, limit) {
        return {
            logs: entities.map((e) => this.toResponseDto(e)),
            total,
            page,
            limit,
        };
    }
    static toEntity(dto) {
        return new AuditLog_1.AuditLog(null, dto.userId, dto.userRole, dto.userName, dto.action, dto.entityType, dto.entityId || null, dto.details, dto.ipAddress);
    }
}
exports.AuditMapper = AuditMapper;
//# sourceMappingURL=AuditMapper.js.map