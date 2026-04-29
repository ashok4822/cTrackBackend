"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDAMapper = void 0;
class PDAMapper {
    static toBalanceResponseDto(balance, lowBalanceThreshold) {
        return {
            balance,
            lowBalanceThreshold,
        };
    }
    static toTransactionResponseDto(tx) {
        return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            balanceAfter: tx.balanceAfter,
            timestamp: tx.timestamp,
        };
    }
    static toTransactionCollectionResponseDto(transactions) {
        return {
            items: transactions.map(tx => this.toTransactionResponseDto(tx)),
            total: transactions.length,
        };
    }
    static toPDAResponseDto(pda, transactions, lowBalanceThreshold) {
        return {
            id: pda.id,
            userId: pda.userId,
            customer: pda.customer,
            balance: pda.balance,
            lastUpdated: pda.lastUpdated,
            transactions: transactions?.map(tx => this.toTransactionResponseDto(tx)),
            lowBalanceThreshold,
        };
    }
}
exports.PDAMapper = PDAMapper;
//# sourceMappingURL=PDAMapper.js.map