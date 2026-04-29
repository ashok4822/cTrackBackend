"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRequestRepository = void 0;
const ContainerRequest_1 = require("../../domain/entities/ContainerRequest");
const ContainerRequestModel_1 = require("../models/ContainerRequestModel");
const mongoose_1 = __importDefault(require("mongoose"));
class ContainerRequestRepository {
    mapToEntity(doc) {
        const d = doc;
        return new ContainerRequest_1.ContainerRequest(d._id.toString(), d.customerId, d.type, d.status, d.cargoCategoryId?.toString(), d.cargoCategoryName, d.containerSize, d.containerType, d.cargoDescription, d.cargoWeight, d.preferredDate, d.specialInstructions, d.isHazardous, d.hazardClass, d.unNumber, d.packingGroup, d.containerId?.toString(), d.containerNumber, d.remarks, d.checkpoints, d.cargoCharge, d.createdAt, d.updatedAt, d.customerName);
    }
    async create(request) {
        const created = await ContainerRequestModel_1.ContainerRequestModel.create({
            customerId: request.customerId,
            type: request.type,
            status: request.status,
            cargoCategoryId: request.cargoCategoryId
                ? new mongoose_1.default.Types.ObjectId(request.cargoCategoryId)
                : undefined,
            containerSize: request.containerSize,
            containerType: request.containerType,
            cargoDescription: request.cargoDescription,
            cargoWeight: request.cargoWeight,
            preferredDate: request.preferredDate,
            specialInstructions: request.specialInstructions,
            isHazardous: request.isHazardous,
            hazardClass: request.hazardClass,
            unNumber: request.unNumber,
            packingGroup: request.packingGroup,
            containerId: request.containerId
                ? new mongoose_1.default.Types.ObjectId(request.containerId)
                : undefined,
            containerNumber: request.containerNumber,
            remarks: request.remarks,
            checkpoints: request.checkpoints,
            cargoCharge: request.cargoCharge,
        });
        return this.mapToEntity(created);
    }
    async findByCustomerId(customerId) {
        const pipeline = [
            { $match: { customerId } },
            // Join container details (for destuffing cargo info)
            {
                $lookup: {
                    from: "containers",
                    localField: "containerId",
                    foreignField: "_id",
                    as: "containerDetails",
                },
            },
            {
                $unwind: {
                    path: "$containerDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Resolve cargo fields: prefer request's own values, fall back to container
            {
                $addFields: {
                    cargoDescription: {
                        $cond: [
                            {
                                $gt: [{ $strLenCP: { $ifNull: ["$cargoDescription", ""] } }, 0],
                            },
                            "$cargoDescription",
                            { $ifNull: ["$containerDetails.cargoDescription", null] },
                        ],
                    },
                    cargoWeight: {
                        $cond: [
                            { $gt: [{ $ifNull: ["$cargoWeight", 0] }, 0] },
                            "$cargoWeight",
                            { $ifNull: ["$containerDetails.cargoWeight", null] },
                        ],
                    },
                    isHazardous: {
                        $cond: [
                            { $ifNull: ["$isHazardous", false] },
                            "$isHazardous",
                            { $ifNull: ["$containerDetails.hazardousClassification", false] },
                        ],
                    },
                    cargoCharge: { $ifNull: ["$cargoCharge", 0] },
                },
            },
            {
                $addFields: {
                    id: "$_id",
                },
            },
            {
                $lookup: {
                    from: "cargocategories",
                    localField: "cargoCategoryId",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    cargoCategoryName: {
                        $ifNull: [
                            "$categoryDetails.name",
                            "$containerDetails.cargoCategory",
                        ],
                    },
                },
            },
            {
                $project: { containerDetails: 0, categoryDetails: 0 },
            },
            { $sort: { createdAt: -1 } },
        ];
        const results = await ContainerRequestModel_1.ContainerRequestModel.aggregate(pipeline);
        return results.map((doc) => this.mapToEntity(doc));
    }
    async findById(id) {
        const doc = await ContainerRequestModel_1.ContainerRequestModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }
    async findAll() {
        const pipeline = [
            // --- Join user (customer) details ---
            {
                $addFields: {
                    customerIdObjectId: {
                        $convert: {
                            input: "$customerId",
                            to: "objectId",
                            onError: null,
                            onNull: null,
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "customerIdObjectId",
                    foreignField: "_id",
                    as: "customerDetails",
                },
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // --- Join container details (for destuffing) ---
            {
                $lookup: {
                    from: "containers",
                    localField: "containerId",
                    foreignField: "_id",
                    as: "containerDetails",
                },
            },
            {
                $unwind: {
                    path: "$containerDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // --- Build display fields ---
            {
                $addFields: {
                    // Customer name: companyName > name > customerId
                    customerName: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $strLenCP: {
                                            $ifNull: ["$customerDetails.companyName", ""],
                                        },
                                    },
                                    0,
                                ],
                            },
                            "$customerDetails.companyName",
                            {
                                $cond: [
                                    {
                                        $gt: [
                                            { $strLenCP: { $ifNull: ["$customerDetails.name", ""] } },
                                            0,
                                        ],
                                    },
                                    "$customerDetails.name",
                                    "$customerId",
                                ],
                            },
                        ],
                    },
                    id: "$_id",
                    // For destuffing: use cargo details from the linked container
                    // if the request itself doesn't have them
                    cargoDescription: {
                        $cond: [
                            {
                                $gt: [{ $strLenCP: { $ifNull: ["$cargoDescription", ""] } }, 0],
                            },
                            "$cargoDescription",
                            { $ifNull: ["$containerDetails.cargoDescription", null] },
                        ],
                    },
                    cargoWeight: {
                        $cond: [
                            { $gt: [{ $ifNull: ["$cargoWeight", 0] }, 0] },
                            "$cargoWeight",
                            { $ifNull: ["$containerDetails.cargoWeight", null] },
                        ],
                    },
                    isHazardous: {
                        $cond: [
                            { $ifNull: ["$isHazardous", false] },
                            "$isHazardous",
                            { $ifNull: ["$containerDetails.hazardousClassification", false] },
                        ],
                    },
                    cargoCharge: { $ifNull: ["$cargoCharge", 0] },
                },
            },
            // --- Join cargo category ---
            {
                $lookup: {
                    from: "cargocategories",
                    localField: "cargoCategoryId",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    cargoCategoryName: {
                        $ifNull: [
                            "$categoryDetails.name",
                            "$containerDetails.cargoCategory",
                        ],
                    },
                },
            },
            {
                $project: {
                    customerDetails: 0,
                    customerIdObjectId: 0,
                    containerDetails: 0,
                    categoryDetails: 0,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ];
        const results = await ContainerRequestModel_1.ContainerRequestModel.aggregate(pipeline);
        return results.map((doc) => this.mapToEntity(doc));
    }
    async update(id, data) {
        // Prepare update object handling undefined carefully
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...rest } = data;
        const updateData = { ...rest };
        if (data.containerId) {
            updateData.containerId = new mongoose_1.default.Types.ObjectId(data.containerId);
        }
        const updated = await ContainerRequestModel_1.ContainerRequestModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        return updated ? this.mapToEntity(updated) : null;
    }
    async updateStatus(id, status) {
        const updated = await ContainerRequestModel_1.ContainerRequestModel.findByIdAndUpdate(id, { status }, { new: true });
        return updated ? this.mapToEntity(updated) : null;
    }
    async findByContainerNumber(containerNumber) {
        const doc = await ContainerRequestModel_1.ContainerRequestModel.findOne({
            containerNumber,
            status: { $in: ["ready-for-dispatch", "approved"] },
        }).sort({ createdAt: -1 });
        return doc ? this.mapToEntity(doc) : null;
    }
    async findActiveRequestsByCustomerId(customerId) {
        const activeStatuses = [
            "pending",
            "approved",
            "ready-for-dispatch",
            "in-transit",
            "at-factory",
            "operation-completed",
        ];
        const docs = await ContainerRequestModel_1.ContainerRequestModel.find({
            customerId,
            status: { $in: activeStatuses },
        });
        return docs.map((doc) => this.mapToEntity(doc));
    }
    applyFilters(filters) {
        const query = {};
        if (filters.customerId) {
            query.customerId = Array.isArray(filters.customerId) ? { $in: filters.customerId } : filters.customerId;
        }
        if (filters.type) {
            query.type = Array.isArray(filters.type) ? { $in: filters.type } : filters.type;
        }
        if (filters.status) {
            query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
        }
        if (filters.containerNumber) {
            query.containerNumber = Array.isArray(filters.containerNumber) ? { $in: filters.containerNumber } : filters.containerNumber;
        }
        if (filters.isHazardous !== undefined) {
            query.isHazardous = filters.isHazardous;
        }
        return query;
    }
    async countPending(filter) {
        const query = this.applyFilters(filter);
        query.status = "pending";
        return await ContainerRequestModel_1.ContainerRequestModel.countDocuments(query);
    }
    async findRecent(filter, limit) {
        const query = this.applyFilters(filter);
        const docs = await ContainerRequestModel_1.ContainerRequestModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);
        return docs.map((doc) => this.mapToEntity(doc));
    }
}
exports.ContainerRequestRepository = ContainerRequestRepository;
//# sourceMappingURL=ContainerRequestRepository.js.map