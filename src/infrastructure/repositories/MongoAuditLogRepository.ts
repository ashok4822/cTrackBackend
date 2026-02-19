import { IAuditLogRepository, AuditLogFilters } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { AuditLogModel } from "../models/AuditLogModel";

export class MongoAuditLogRepository implements IAuditLogRepository {
    async save(auditLog: AuditLog): Promise<AuditLog> {
        const auditLogDocument = new AuditLogModel({
            userId: auditLog.userId,
            userRole: auditLog.userRole,
            userName: auditLog.userName,
            action: auditLog.action,
            entityType: auditLog.entityType,
            entityId: auditLog.entityId,
            details: auditLog.details,
            ipAddress: auditLog.ipAddress,
            timestamp: auditLog.timestamp,
        });

        const savedDocument = await auditLogDocument.save();

        return new AuditLog(
            savedDocument._id.toString(),
            savedDocument.userId,
            savedDocument.userRole,
            savedDocument.userName,
            savedDocument.action as any,
            savedDocument.entityType as any,
            savedDocument.entityId || null,
            savedDocument.details,
            savedDocument.ipAddress,
            savedDocument.timestamp,
            savedDocument.createdAt,
            savedDocument.updatedAt
        );
    }

    async findAll(filters?: AuditLogFilters): Promise<{ logs: AuditLog[]; total: number }> {
        const query: any = {};

        if (filters?.startDate || filters?.endDate) {
            query.timestamp = {};
            if (filters.startDate) {
                query.timestamp.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.timestamp.$lte = filters.endDate;
            }
        }

        if (filters?.userId) {
            query.userId = filters.userId;
        }

        if (filters?.actionType) {
            query.action = filters.actionType;
        }

        if (filters?.entityType) {
            query.entityType = filters.entityType;
        }

        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;

        const [documents, total] = await Promise.all([
            AuditLogModel.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            AuditLogModel.countDocuments(query).exec(),
        ]);

        const logs = documents.map(doc => new AuditLog(
            doc._id.toString(),
            doc.userId,
            doc.userRole,
            doc.userName,
            doc.action as any,
            doc.entityType as any,
            doc.entityId || null,
            doc.details,
            doc.ipAddress,
            doc.timestamp,
            doc.createdAt,
            doc.updatedAt
        ));

        return { logs, total };
    }

    async findById(id: string): Promise<AuditLog | null> {
        const document = await AuditLogModel.findById(id).exec();
        if (!document) {
            return null;
        }

        return new AuditLog(
            document._id.toString(),
            document.userId,
            document.userRole,
            document.userName,
            document.action as any,
            document.entityType as any,
            document.entityId || null,
            document.details,
            document.ipAddress,
            document.timestamp,
            document.createdAt,
            document.updatedAt
        );
    }
}
