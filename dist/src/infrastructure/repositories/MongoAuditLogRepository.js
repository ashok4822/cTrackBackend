"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoAuditLogRepository = void 0;
const AuditLog_1 = require("../../domain/entities/AuditLog");
const AuditLogModel_1 = require("../models/AuditLogModel");
class MongoAuditLogRepository {
    async save(auditLog) {
        const auditLogDocument = new AuditLogModel_1.AuditLogModel({
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
        return new AuditLog_1.AuditLog(savedDocument._id.toString(), savedDocument.userId, savedDocument.userRole, savedDocument.userName, savedDocument.action, savedDocument.entityType, savedDocument.entityId || null, savedDocument.details, savedDocument.ipAddress, savedDocument.timestamp, savedDocument.createdAt, savedDocument.updatedAt);
    }
    async findAll(filters) {
        const query = {};
        if (filters?.startDate || filters?.endDate) {
            const timestampQuery = {};
            if (filters.startDate) {
                timestampQuery.$gte = filters.startDate;
            }
            if (filters.endDate) {
                timestampQuery.$lte = filters.endDate;
            }
            query.timestamp = timestampQuery;
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
            AuditLogModel_1.AuditLogModel.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            AuditLogModel_1.AuditLogModel.countDocuments(query).exec(),
        ]);
        const logs = documents.map((doc) => new AuditLog_1.AuditLog(doc._id.toString(), doc.userId, doc.userRole, doc.userName, doc.action, doc.entityType, doc.entityId || null, doc.details, doc.ipAddress, doc.timestamp, doc.createdAt, doc.updatedAt));
        return { logs, total };
    }
    async findById(id) {
        const document = await AuditLogModel_1.AuditLogModel.findById(id).exec();
        if (!document) {
            return null;
        }
        return new AuditLog_1.AuditLog(document._id.toString(), document.userId, document.userRole, document.userName, document.action, document.entityType, document.entityId || null, document.details, document.ipAddress, document.timestamp, document.createdAt, document.updatedAt);
    }
}
exports.MongoAuditLogRepository = MongoAuditLogRepository;
//# sourceMappingURL=MongoAuditLogRepository.js.map