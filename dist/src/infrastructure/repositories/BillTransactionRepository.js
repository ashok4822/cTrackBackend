"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillTransactionRepository = void 0;
const BillTransaction_1 = require("../../domain/entities/BillTransaction");
const BillTransactionModel_1 = require("../models/BillTransactionModel");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class BillTransactionRepository {
    mapToEntity(doc) {
        return new BillTransaction_1.BillTransaction(doc._id.toString(), doc.billId.toString(), doc.userId.toString(), doc.amount, doc.method, doc.status, doc.transactionId, doc.orderId, doc.errorDetails, doc.timestamp, doc.createdAt, doc.updatedAt);
    }
    async save(transaction) {
        const data = {
            billId: transaction.billId,
            userId: transaction.userId,
            amount: transaction.amount,
            method: transaction.method,
            status: transaction.status,
            transactionId: transaction.transactionId,
            orderId: transaction.orderId,
            errorDetails: transaction.errorDetails,
            timestamp: transaction.timestamp,
        };
        let savedDoc;
        if (transaction.id) {
            savedDoc = await BillTransactionModel_1.BillTransactionModel.findByIdAndUpdate(transaction.id, data, { new: true });
        }
        else {
            savedDoc = await BillTransactionModel_1.BillTransactionModel.create(data);
        }
        if (!savedDoc) {
            throw new Error(ResponseMessage_1.ResponseMessage.TRANSACTION_NOT_FOUND);
        }
        return this.mapToEntity(savedDoc);
    }
    async findById(id) {
        const doc = await BillTransactionModel_1.BillTransactionModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }
    async findByBillId(billId) {
        const docs = await BillTransactionModel_1.BillTransactionModel.find({ billId }).sort({ timestamp: -1 });
        return docs.map(doc => this.mapToEntity(doc));
    }
    async findByOrderId(orderId) {
        const doc = await BillTransactionModel_1.BillTransactionModel.findOne({ orderId });
        return doc ? this.mapToEntity(doc) : null;
    }
    async updateStatus(id, status, details) {
        const doc = await BillTransactionModel_1.BillTransactionModel.findByIdAndUpdate(id, { status, ...details }, { new: true });
        return doc ? this.mapToEntity(doc) : null;
    }
}
exports.BillTransactionRepository = BillTransactionRepository;
//# sourceMappingURL=BillTransactionRepository.js.map