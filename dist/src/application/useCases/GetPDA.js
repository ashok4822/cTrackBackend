"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPDA = void 0;
const PDAMapper_1 = require("../mappers/PDAMapper");
class GetPDA {
    _pdaRepository;
    _userRepository;
    _configService;
    constructor(_pdaRepository, _userRepository, _configService) {
        this._pdaRepository = _pdaRepository;
        this._userRepository = _userRepository;
        this._configService = _configService;
    }
    async execute(userId, role) {
        const lowBalanceThreshold = this._configService.getNumber('PDA_LOW_BALANCE_THRESHOLD');
        if (role === "admin" || role === "operator") {
            const pdas = await this._pdaRepository.findAll();
            return await Promise.all(pdas.map(async (pda) => {
                const transactions = await this._pdaRepository.findTransactionsByPdaId(pda.id);
                return PDAMapper_1.PDAMapper.toPDAResponseDto(pda, transactions, lowBalanceThreshold);
            }));
        }
        let pda = await this._pdaRepository.findByUserId(userId);
        // If PDA doesn't exist for customer, create it on first access
        if (!pda) {
            const user = await this._userRepository.findById(userId);
            if (user && user.role === "customer") {
                pda = await this._pdaRepository.create({
                    userId,
                    customer: user.companyName || user.name || "Unknown",
                    balance: 0,
                });
            }
        }
        if (pda) {
            const transactions = await this._pdaRepository.findTransactionsByPdaId(pda.id);
            return PDAMapper_1.PDAMapper.toPDAResponseDto(pda, transactions, lowBalanceThreshold);
        }
        return null;
    }
}
exports.GetPDA = GetPDA;
//# sourceMappingURL=GetPDA.js.map