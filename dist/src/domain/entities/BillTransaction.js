"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillTransaction = void 0;
class BillTransaction {
    id;
    billId;
    userId;
    amount;
    method;
    status;
    transactionId;
    orderId;
    errorDetails;
    timestamp;
    createdAt;
    updatedAt;
    constructor(id, billId, userId, amount, method, status, transactionId, orderId, errorDetails, timestamp = new Date(), createdAt, updatedAt) {
        this.id = id;
        this.billId = billId;
        this.userId = userId;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.errorDetails = errorDetails;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.BillTransaction = BillTransaction;
//# sourceMappingURL=BillTransaction.js.map