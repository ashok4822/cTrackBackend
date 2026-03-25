import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";
import { ChargeHistory } from "../../domain/entities/ChargeHistory";
import { ChargeHistoryModel, IChargeHistoryDocument } from "../models/ChargeHistoryModel";

export class ChargeHistoryRepository implements IChargeHistoryRepository {
    async save(history: ChargeHistory): Promise<ChargeHistory> {
        const doc = new ChargeHistoryModel(history);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject() as IChargeHistoryDocument);
    }

    async findAll(): Promise<ChargeHistory[]> {
        const docs = await ChargeHistoryModel.find().sort({ changedAt: -1 }).lean();
        return (docs as unknown as IChargeHistoryDocument[]).map(doc => this.mapToEntity(doc));
    }

    async findByChargeId(chargeId: string): Promise<ChargeHistory[]> {
        const docs = await ChargeHistoryModel.find({ chargeId }).sort({ changedAt: -1 }).lean();
        return (docs as unknown as IChargeHistoryDocument[]).map(doc => this.mapToEntity(doc));
    }

    private mapToEntity(doc: IChargeHistoryDocument): ChargeHistory {
        return {
            id: doc._id!.toString(),
            chargeId: doc.chargeId.toString(),
            activityName: doc.activityName,
            containerSize: doc.containerSize,
            containerType: doc.containerType,
            oldRate: doc.oldRate,
            newRate: doc.newRate,
            currency: doc.currency,
            changedAt: doc.changedAt
        };
    }
}
