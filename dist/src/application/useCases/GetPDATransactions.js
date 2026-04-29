"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPDATransactions = void 0;
const PDAMapper_1 = require("../mappers/PDAMapper");
class GetPDATransactions {
    _pdaRepository;
    constructor(_pdaRepository) {
        this._pdaRepository = _pdaRepository;
    }
    async execute(userId) {
        const pda = await this._pdaRepository.findByUserId(userId);
        if (!pda) {
            return PDAMapper_1.PDAMapper.toTransactionCollectionResponseDto([]);
        }
        const transactions = await this._pdaRepository.findTransactionsByPdaId(pda.id);
        return PDAMapper_1.PDAMapper.toTransactionCollectionResponseDto(transactions);
    }
}
exports.GetPDATransactions = GetPDATransactions;
//# sourceMappingURL=GetPDATransactions.js.map