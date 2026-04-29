"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCharges = void 0;
const ChargeMapper_1 = require("../mappers/ChargeMapper");
class GetCharges {
    chargeRepository;
    constructor(chargeRepository) {
        this.chargeRepository = chargeRepository;
    }
    async execute() {
        const charges = await this.chargeRepository.findAll();
        return charges.map(c => ChargeMapper_1.ChargeMapper.toResponseDto(c));
    }
}
exports.GetCharges = GetCharges;
//# sourceMappingURL=GetCharges.js.map