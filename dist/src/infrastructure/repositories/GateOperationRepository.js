"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateOperationRepository = void 0;
const GateOperation_1 = require("../../domain/entities/GateOperation");
const GateOperationModel_1 = require("../models/GateOperationModel");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class GateOperationRepository {
    applyFilters(filters) {
        const query = {};
        if (filters.type) {
            query.type = filters.type;
        }
        if (filters.containerNumber) {
            query.containerNumber = Array.isArray(filters.containerNumber) ? { $in: filters.containerNumber } : filters.containerNumber;
        }
        if (filters.vehicleNumber) {
            query.vehicleNumber = { $regex: `^${filters.vehicleNumber}$`, $options: "i" };
        }
        if (filters.startDate || filters.endDate) {
            const timestampFilter = {};
            if (filters.startDate)
                timestampFilter.$gte = filters.startDate;
            if (filters.endDate)
                timestampFilter.$lte = filters.endDate;
            query.timestamp = timestampFilter;
        }
        return query;
    }
    async findAll(filters) {
        const query = filters ? this.applyFilters(filters) : {};
        let mQuery = GateOperationModel_1.GateOperationModel.find(query).sort({ timestamp: -1 });
        if (filters?.limit) {
            mQuery = mQuery.limit(filters.limit);
        }
        const operations = await mQuery;
        return operations.map((o) => this.toEntity(o));
    }
    async findById(id) {
        const operation = await GateOperationModel_1.GateOperationModel.findById(id);
        if (!operation)
            return null;
        return this.toEntity(operation);
    }
    async save(operation) {
        const data = {
            type: operation.type,
            containerNumber: operation.containerNumber,
            vehicleNumber: operation.vehicleNumber,
            driverName: operation.driverName,
            purpose: operation.purpose,
            timestamp: operation.timestamp,
            approvedBy: operation.approvedBy,
            remarks: operation.remarks,
            cargoCategory: operation.cargoCategory,
        };
        if (operation.id && operation.id.match(/^[0-9a-fA-F]{24}$/)) {
            const updated = await GateOperationModel_1.GateOperationModel.findByIdAndUpdate(operation.id, data, { new: true });
            if (!updated)
                throw new Error(ResponseMessage_1.ResponseMessage.GATE_OPERATION_NOT_FOUND);
            return this.toEntity(updated);
        }
        else {
            const newOperation = new GateOperationModel_1.GateOperationModel(data);
            const saved = await newOperation.save();
            return this.toEntity(saved);
        }
    }
    toEntity(o) {
        return new GateOperation_1.GateOperation(o.id, o.type, o.containerNumber, o.vehicleNumber, o.driverName, o.purpose, o.timestamp, o.approvedBy, o.remarks, o.cargoCategory);
    }
    async count(filter) {
        const query = this.applyFilters(filter);
        return await GateOperationModel_1.GateOperationModel.countDocuments(query).exec();
    }
    async getDailyMovements(filter) {
        const query = this.applyFilters(filter);
        const results = await GateOperationModel_1.GateOperationModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$timestamp",
                                timezone: "Asia/Kolkata",
                            },
                        },
                        type: "$type",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.day": 1 } },
        ]).exec();
        return results.map(r => ({
            day: r._id.day,
            type: r._id.type,
            count: r.count
        }));
    }
}
exports.GateOperationRepository = GateOperationRepository;
//# sourceMappingURL=GateOperationRepository.js.map