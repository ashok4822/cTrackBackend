"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeHistoryRepository = void 0;
const ChargeHistoryModel_1 = require("../models/ChargeHistoryModel");
class ChargeHistoryRepository {
    async save(history) {
        const doc = new ChargeHistoryModel_1.ChargeHistoryModel(history);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }
    async findAll() {
        const docs = await ChargeHistoryModel_1.ChargeHistoryModel.find().sort({ changedAt: -1 }).lean();
        return docs.map(doc => this.mapToEntity(doc));
    }
    async findByChargeId(chargeId) {
        const docs = await ChargeHistoryModel_1.ChargeHistoryModel.find({ chargeId }).sort({ changedAt: -1 }).lean();
        return docs.map(doc => this.mapToEntity(doc));
    }
    mapToEntity(doc) {
        return {
            id: doc._id.toString(),
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
exports.ChargeHistoryRepository = ChargeHistoryRepository;
//# sourceMappingURL=ChargeHistoryRepository.js.map