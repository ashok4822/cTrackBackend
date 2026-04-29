"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDATransaction = exports.PDA = void 0;
class PDA {
    id;
    userId;
    customer;
    balance;
    lastUpdated;
    constructor(id, userId, customer, // fallback to name
    balance = 0, lastUpdated = new Date()) {
        this.id = id;
        this.userId = userId;
        this.customer = customer;
        this.balance = balance;
        this.lastUpdated = lastUpdated;
    }
}
exports.PDA = PDA;
class PDATransaction {
    id;
    pdaId;
    type;
    amount;
    description;
    balanceAfter;
    timestamp;
    constructor(id, pdaId, type, amount, description, balanceAfter, timestamp = new Date()) {
        this.id = id;
        this.pdaId = pdaId;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.balanceAfter = balanceAfter;
        this.timestamp = timestamp;
    }
}
exports.PDATransaction = PDATransaction;
//# sourceMappingURL=PDA.js.map