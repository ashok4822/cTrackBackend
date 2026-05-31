import { IGateOperationRepository, GateOperationFilter, DailyMovement } from "../../domain/repositories/IGateOperationRepository";
import { GateOperation } from "../../domain/entities/GateOperation";
import { GateOperationModel, IGateOperationDocument } from "../models/GateOperationModel";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class GateOperationRepository implements IGateOperationRepository {
    private _applyFilters(filters: GateOperationFilter): Record<string, unknown> {
        const query: Record<string, unknown> = {};

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
            const timestampFilter: Record<string, Date> = {};
            if (filters.startDate) timestampFilter.$gte = filters.startDate;
            if (filters.endDate) timestampFilter.$lte = filters.endDate;
            query.timestamp = timestampFilter;
        }

        return query;
    }

    async findAll(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
    }): Promise<GateOperation[]> {
        const query = filters ? this._applyFilters(filters as GateOperationFilter) : {};

        let mQuery = GateOperationModel.find(query).sort({ timestamp: -1 });
        if (filters?.limit) {
            mQuery = mQuery.limit(filters.limit);
        }

        const operations = await mQuery;
        return operations.map((o) => this._toEntity(o));
    }

    async findById(id: string): Promise<GateOperation | null> {
        const operation = await GateOperationModel.findById(id);
        if (!operation) return null;
        return this._toEntity(operation);
    }

    async save(operation: GateOperation): Promise<GateOperation> {
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
            const updated = await GateOperationModel.findByIdAndUpdate(operation.id, data, { new: true });
            if (!updated) throw new Error(ResponseMessage.GATE_OPERATION_NOT_FOUND);
            return this._toEntity(updated);
        } else {
            const newOperation = new GateOperationModel(data);
            const saved = await newOperation.save();
            return this._toEntity(saved);
        }
    }

    private _toEntity(o: IGateOperationDocument): GateOperation {
        return new GateOperation(
            o.id as string,
            o.type,
            o.containerNumber,
            o.vehicleNumber,
            o.driverName,
            o.purpose,
            o.timestamp,
            o.approvedBy,
            o.remarks,
            o.cargoCategory
        );
    }

    async count(filter: GateOperationFilter): Promise<number> {
        const query = this._applyFilters(filter);
        return await GateOperationModel.countDocuments(query).exec();
    }

    async getDailyMovements(filter: GateOperationFilter): Promise<DailyMovement[]> {
        const query = this._applyFilters(filter);
        const results = await GateOperationModel.aggregate([
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
            { $sort: { "_id.day": 1 as const } },
        ]).exec();

        return results.map(r => ({
            day: r._id.day,
            type: r._id.type,
            count: r.count
        }));
    }
}
