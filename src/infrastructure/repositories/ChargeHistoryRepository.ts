import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";
import { ChargeHistory } from "../../domain/entities/ChargeHistory";
import { ChargeHistoryModel } from "../models/ChargeHistoryModel";

export class ChargeHistoryRepository implements IChargeHistoryRepository {
    async save(history: ChargeHistory): Promise<ChargeHistory> {
        const doc = new ChargeHistoryModel(history);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }

    async findAll(): Promise<ChargeHistory[]> {
        const docs = await ChargeHistoryModel.find().sort({ changedAt: -1 }).lean();
        return docs.map(this.mapToEntity);
    }

    async findByChargeId(chargeId: string): Promise<ChargeHistory[]> {
        const docs = await ChargeHistoryModel.find({ chargeId }).sort({ changedAt: -1 }).lean();
        return docs.map(this.mapToEntity);
    }

    private mapToEntity(doc: any): ChargeHistory {
        const { _id, __v, ...rest } = doc;
        return {
            id: _id.toString(),
            ...rest
        };
    }
}
