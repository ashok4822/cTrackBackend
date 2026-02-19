import { IGateOperationRepository, GateOperationFilters } from "../../domain/repositories/IGateOperationRepository";
import { GateOperation } from "../../domain/entities/GateOperation";
import { GateOperationModel } from "../models/GateOperationModel";

export class GateOperationRepository implements IGateOperationRepository {
    async findAll(filter: GateOperationFilters = {}): Promise<GateOperation[]> {
        const operations = await GateOperationModel.find(filter).sort({ timestamp: -1 });
        return operations.map(this.toEntity);
    }

    async findById(id: string): Promise<GateOperation | null> {
        const operation = await GateOperationModel.findById(id);
        if (!operation) return null;
        return this.toEntity(operation);
    }

    async save(operation: GateOperation): Promise<void> {
        const data = {
            type: operation.type,
            containerNumber: operation.containerNumber,
            vehicleNumber: operation.vehicleNumber,
            driverName: operation.driverName,
            purpose: operation.purpose,
            status: operation.status,
            timestamp: operation.timestamp,
            approvedBy: operation.approvedBy,
            remarks: operation.remarks,
        };

        if (operation.id && operation.id.match(/^[0-9a-fA-F]{24}$/)) {
            await GateOperationModel.findByIdAndUpdate(operation.id, data);
        } else {
            const newOp = new GateOperationModel(data);
            await newOp.save();
        }
    }

    private toEntity(doc: any): GateOperation {
        return new GateOperation(
            doc.id,
            doc.type,
            doc.containerNumber,
            doc.vehicleNumber,
            doc.driverName,
            doc.purpose,
            doc.status,
            doc.timestamp,
            doc.approvedBy,
            doc.remarks,
            doc.createdAt,
            doc.updatedAt
        );
    }
}
