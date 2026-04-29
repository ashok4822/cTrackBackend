"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBills = void 0;
const BillingMapper_1 = require("../mappers/BillingMapper");
class GetBills {
    _billRepository;
    constructor(_billRepository) {
        this._billRepository = _billRepository;
    }
    async execute(request) {
        const { customerId, status } = request;
        const bills = await this._billRepository.findAll(customerId, status);
        return BillingMapper_1.BillingMapper.toCollectionResponseDto(bills);
    }
}
exports.GetBills = GetBills;
//# sourceMappingURL=GetBills.js.map