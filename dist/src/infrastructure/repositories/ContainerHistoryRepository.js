"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerHistoryRepository = void 0;
const ContainerHistory_1 = require("../../domain/entities/ContainerHistory");
const ContainerHistoryModel_1 = require("../models/ContainerHistoryModel");
class ContainerHistoryRepository {
    async findByContainerId(containerId) {
        const histories = await ContainerHistoryModel_1.ContainerHistoryModel.find({ containerId }).sort({ timestamp: -1 });
        return histories.map(h => new ContainerHistory_1.ContainerHistory(h._id.toString(), h.containerId.toString(), h.activity, h.details, h.performedBy, h.timestamp, h.createdAt, h.updatedAt));
    }
    async save(history) {
        const historyData = {
            containerId: typeof history.containerId === 'object' ? history.containerId.id : history.containerId,
            activity: history.activity,
            details: history.details,
            performedBy: history.performedBy,
            timestamp: history.timestamp || new Date()
        };
        if (history.id) {
            await ContainerHistoryModel_1.ContainerHistoryModel.findByIdAndUpdate(history.id, historyData);
        }
        else {
            await ContainerHistoryModel_1.ContainerHistoryModel.create(historyData);
        }
    }
    toEntity(h) {
        // Handle both populated and unpopulated containerId
        const containerId = h.containerId;
        let containerIdStr = "";
        let populatedData;
        if (containerId && typeof containerId === 'object' && 'containerNumber' in containerId) {
            const pc = containerId;
            containerIdStr = pc._id.toString();
            populatedData = {
                id: pc._id.toString(),
                containerNumber: pc.containerNumber
            };
        }
        else if (containerId) {
            containerIdStr = String(containerId);
        }
        const entity = new ContainerHistory_1.ContainerHistory(h._id.toString(), containerIdStr, h.activity, h.details, h.performedBy, h.timestamp, h.createdAt, h.updatedAt);
        if (populatedData) {
            entity.containerId = populatedData;
        }
        return entity;
    }
    applyFilters(filters) {
        const query = {};
        if (filters.containerId) {
            query.containerId = Array.isArray(filters.containerId) ? { $in: filters.containerId } : filters.containerId;
        }
        if (filters.activity) {
            query.activity = Array.isArray(filters.activity) ? { $in: filters.activity } : filters.activity;
        }
        if (filters.performedBy) {
            query.performedBy = Array.isArray(filters.performedBy) ? { $in: filters.performedBy } : filters.performedBy;
        }
        return query;
    }
    async findRecent(filter, limit) {
        const query = this.applyFilters(filter);
        const histories = await ContainerHistoryModel_1.ContainerHistoryModel.find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate("containerId", "containerNumber");
        return histories.map(h => this.toEntity(h));
    }
}
exports.ContainerHistoryRepository = ContainerHistoryRepository;
//# sourceMappingURL=ContainerHistoryRepository.js.map