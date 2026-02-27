import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { ContainerRequestModel } from "../models/ContainerRequestModel";
import mongoose from "mongoose";

export class ContainerRequestRepository implements IContainerRequestRepository {
    private mapToEntity(doc: any): ContainerRequest {
        return new ContainerRequest(
            doc._id.toString(),
            doc.customerId,
            doc.type,
            doc.status,
            doc.containerSize,
            doc.containerType,
            doc.cargoDescription,
            doc.cargoWeight,
            doc.preferredDate,
            doc.specialInstructions,
            doc.isHazardous,
            doc.hazardClass,
            doc.unNumber,
            doc.packingGroup,
            doc.containerId?.toString(),
            doc.containerNumber,
            doc.remarks,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async create(request: ContainerRequest): Promise<ContainerRequest> {
        const created = await ContainerRequestModel.create({
            customerId: request.customerId,
            type: request.type,
            status: request.status,
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
            containerId: request.containerId ? new mongoose.Types.ObjectId(request.containerId) as any : undefined,
            containerNumber: request.containerNumber,
            remarks: request.remarks,
        });
        return this.mapToEntity(created);
    }

    async findByCustomerId(customerId: string): Promise<any[]> {
        const pipeline: any[] = [
            { $match: { customerId } },
            // Join container details (for destuffing cargo info)
            {
                $lookup: {
                    from: "containers",
                    localField: "containerId",
                    foreignField: "_id",
                    as: "containerDetails"
                }
            },
            {
                $unwind: {
                    path: "$containerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Resolve cargo fields: prefer request's own values, fall back to container
            {
                $addFields: {
                    cargoDescription: {
                        $cond: [
                            { $gt: [{ $strLenCP: { $ifNull: ["$cargoDescription", ""] } }, 0] },
                            "$cargoDescription",
                            { $ifNull: ["$containerDetails.cargoDescription", null] }
                        ]
                    },
                    cargoWeight: {
                        $cond: [
                            { $gt: [{ $ifNull: ["$cargoWeight", 0] }, 0] },
                            "$cargoWeight",
                            { $ifNull: ["$containerDetails.cargoWeight", null] }
                        ]
                    },
                    isHazardous: {
                        $cond: [
                            { $ifNull: ["$isHazardous", false] },
                            "$isHazardous",
                            { $ifNull: ["$containerDetails.hazardousClassification", false] }
                        ]
                    }
                }
            },
            {
                $project: { containerDetails: 0 }
            },
            { $sort: { createdAt: -1 as const } }
        ];

        return await ContainerRequestModel.aggregate(pipeline);
    }

    async findById(id: string): Promise<ContainerRequest | null> {
        const doc = await ContainerRequestModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }

    async findAll(): Promise<any[]> {
        const pipeline: any[] = [
            // --- Join user (customer) details ---
            {
                $addFields: {
                    customerIdObjectId: { $toObjectId: "$customerId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "customerIdObjectId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // --- Join container details (for destuffing) ---
            {
                $lookup: {
                    from: "containers",
                    localField: "containerId",
                    foreignField: "_id",
                    as: "containerDetails"
                }
            },
            {
                $unwind: {
                    path: "$containerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // --- Build display fields ---
            {
                $addFields: {
                    // Customer name: companyName > name > customerId
                    customerName: {
                        $cond: [
                            { $gt: [{ $strLenCP: { $ifNull: ["$customerDetails.companyName", ""] } }, 0] },
                            "$customerDetails.companyName",
                            {
                                $cond: [
                                    { $gt: [{ $strLenCP: { $ifNull: ["$customerDetails.name", ""] } }, 0] },
                                    "$customerDetails.name",
                                    "$customerId"
                                ]
                            }
                        ]
                    },
                    // For destuffing: use cargo details from the linked container
                    // if the request itself doesn't have them
                    cargoDescription: {
                        $cond: [
                            { $gt: [{ $strLenCP: { $ifNull: ["$cargoDescription", ""] } }, 0] },
                            "$cargoDescription",
                            { $ifNull: ["$containerDetails.cargoDescription", null] }
                        ]
                    },
                    cargoWeight: {
                        $cond: [
                            { $gt: [{ $ifNull: ["$cargoWeight", 0] }, 0] },
                            "$cargoWeight",
                            { $ifNull: ["$containerDetails.cargoWeight", null] }
                        ]
                    },
                    isHazardous: {
                        $cond: [
                            { $ifNull: ["$isHazardous", false] },
                            "$isHazardous",
                            { $ifNull: ["$containerDetails.hazardousClassification", false] }
                        ]
                    }
                }
            },
            {
                $project: {
                    customerDetails: 0,
                    customerIdObjectId: 0,
                    containerDetails: 0
                }
            },
            {
                $sort: { createdAt: -1 as const }
            }
        ];

        const results = await ContainerRequestModel.aggregate(pipeline);
        return results;
    }

    async update(id: string, data: Partial<ContainerRequest>): Promise<ContainerRequest | null> {
        // Prepare update object handling undefined carefully
        const updateData: any = { ...data };
        if (data.containerId) {
            updateData.containerId = new mongoose.Types.ObjectId(data.containerId);
        }

        const updated = await ContainerRequestModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        return updated ? this.mapToEntity(updated) : null;
    }

    async updateStatus(id: string, status: string): Promise<ContainerRequest | null> {
        const updated = await ContainerRequestModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return updated ? this.mapToEntity(updated) : null;
    }
}
