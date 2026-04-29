"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDARepository = void 0;
const PDA_1 = require("../../domain/entities/PDA");
const PDAModel_1 = require("../models/PDAModel");
class PDARepository {
    async findByUserId(userId) {
        const doc = await PDAModel_1.PDAModel.findOne({ userId });
        if (!doc)
            return null;
        return new PDA_1.PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated);
    }
    async findAll() {
        const docs = await PDAModel_1.PDAModel.find().sort({ lastUpdated: -1 });
        return docs.map(doc => new PDA_1.PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated));
    }
    async create(pda) {
        const doc = await PDAModel_1.PDAModel.create(pda);
        return new PDA_1.PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated);
    }
    async updateBalance(pdaId, balance) {
        await PDAModel_1.PDAModel.findByIdAndUpdate(pdaId, { balance, lastUpdated: new Date() });
    }
    async createTransaction(transaction) {
        const doc = await PDAModel_1.PDATransactionModel.create(transaction);
        return new PDA_1.PDATransaction(doc._id.toString(), doc.pdaId.toString(), doc.type, doc.amount, doc.description, doc.balanceAfter, doc.timestamp);
    }
    async findTransactionsByPdaId(pdaId) {
        const docs = await PDAModel_1.PDATransactionModel.find({ pdaId }).sort({ timestamp: -1 });
        return docs.map(doc => new PDA_1.PDATransaction(doc._id.toString(), doc.pdaId.toString(), doc.type, doc.amount, doc.description, doc.balanceAfter, doc.timestamp));
    }
    async findByUserOrCustomer(userId, customerName) {
        const conditions = [];
        if (userId)
            conditions.push({ userId });
        if (customerName)
            conditions.push({ customer: customerName });
        if (conditions.length === 0)
            return null;
        const doc = await PDAModel_1.PDAModel.findOne(conditions.length > 1 ? { $or: conditions } : conditions[0]);
        if (!doc)
            return null;
        return new PDA_1.PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated);
    }
}
exports.PDARepository = PDARepository;
//# sourceMappingURL=PDARepository.js.map