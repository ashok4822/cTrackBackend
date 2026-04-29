import { AuditLog, AuditAction, EntityType } from "../../domain/entities/AuditLog";
import {
  AuditLogResponseDto,
  AuditLogCollectionResponseDto,
  CreateAuditLogRequestDto,
  AuditActionDto,
  EntityTypeDto,
} from "../dto/AuditLogDto";

export class AuditMapper {
  static toResponseDto(entity: AuditLog): AuditLogResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      userRole: entity.userRole,
      userName: entity.userName,
      action: entity.action as AuditActionDto,
      entityType: entity.entityType as EntityTypeDto,
      entityId: entity.entityId,
      details: entity.details,
      ipAddress: entity.ipAddress,
      timestamp: entity.timestamp,
      createdAt: entity.createdAt,
    };
  }

  static toCollectionResponseDto(
    entities: AuditLog[],
    total: number,
    page: number,
    limit: number
  ): AuditLogCollectionResponseDto {
    return {
      logs: entities.map((e) => this.toResponseDto(e)),
      total,
      page,
      limit,
    };
  }

  static toEntity(dto: CreateAuditLogRequestDto): AuditLog {
    return new AuditLog(
      null,
      dto.userId,
      dto.userRole,
      dto.userName,
      dto.action as AuditAction,
      dto.entityType as EntityType,
      dto.entityId || null,
      dto.details,
      dto.ipAddress
    );
  }
}

