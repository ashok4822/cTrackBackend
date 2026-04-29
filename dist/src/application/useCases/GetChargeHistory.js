"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChargeHistory = void 0;
const ChargeMapper_1 = require("../mappers/ChargeMapper");
class GetChargeHistory {
    chargeHistoryRepository;
    constructor(chargeHistoryRepository) {
        this.chargeHistoryRepository = chargeHistoryRepository;
    }
    async execute() {
        const history = await this.chargeHistoryRepository.findAll();
        return ChargeMapper_1.ChargeMapper.toHistoryCollectionResponseDto(history);
    }
}
exports.GetChargeHistory = GetChargeHistory;
//# sourceMappingURL=GetChargeHistory.js.map