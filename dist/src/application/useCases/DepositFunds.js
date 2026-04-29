"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositFunds = void 0;
const PDAMapper_1 = require("../mappers/PDAMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class DepositFunds {
    pdaRepository;
    constructor(pdaRepository) {
        this.pdaRepository = pdaRepository;
    }
    async execute(data) {
        const { userId, amount, description } = data;
        const pda = await this.pdaRepository.findByUserId(userId);
        if (!pda)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.PDA_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        const newBalance = pda.balance + amount;
        const transaction = await this.pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "credit",
            amount,
            description,
            balanceAfter: newBalance,
            timestamp: new Date()
        });
        await this.pdaRepository.updateBalance(pda.id, newBalance);
        return PDAMapper_1.PDAMapper.toTransactionResponseDto(transaction);
    }
}
exports.DepositFunds = DepositFunds;
//# sourceMappingURL=DepositFunds.js.map