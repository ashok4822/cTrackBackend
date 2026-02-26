import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { GateOperation } from "../../domain/entities/GateOperation";
import { GateOperationModel } from "../models/GateOperationModel";

export class GateOperationRepository implements IGateOperationRepository {
    async findAll(filters?: {
        type?: "gate-in" | "gate-out";
        containerNumber?: string;
        vehicleNumber?: string;
        limit?: number;
    }): Promise<GateOperation[]> {
        const query: any = {};

        if (filters?.type) {
            query.type = filters.type;
        }
        if (filters?.containerNumber) {
            query.containerNumber = filters.containerNumber;
        }
        if (filters?.vehicleNumber) {
            query.vehicleNumber = { $regex: `^${filters.vehicleNumber}$`, $options: "i" };
        }

        let mQuery = GateOperationModel.find(query).sort({ timestamp: -1 });
        if (filters?.limit) {
            mQuery = mQuery.limit(filters.limit);
        }

        const operations = await mQuery;
        return operations.map(this.toEntity);
    }

    async findById(id: string): Promise<GateOperation | null> {
        const operation = await GateOperationModel.findById(id);
        if (!operation) return null;
        return this.toEntity(operation);
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
        };

        if (operation.id && operation.id.match(/^[0-9a-fA-F]{24}$/)) {
            const updated = await GateOperationModel.findByIdAndUpdate(operation.id, data, { new: true });
            return this.toEntity(updated);
        } else {
            const newOperation = new GateOperationModel(data);
            const saved = await newOperation.save();
            return this.toEntity(saved);
        }
    }

    private toEntity(o: any): GateOperation {
        return new GateOperation(
            o.id,
            o.type,
            o.containerNumber,
            o.vehicleNumber,
            o.driverName,
            o.purpose,
            o.timestamp,
            o.approvedBy,
            o.remarks
        );
    }
}
