"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBillById = void 0;
const BillingMapper_1 = require("../mappers/BillingMapper");
class GetBillById {
    billRepository;
    constructor(billRepository) {
        this.billRepository = billRepository;
    }
    async execute(id) {
        const bill = await this.billRepository.findById(id);
        return bill ? BillingMapper_1.BillingMapper.toResponseDto(bill) : null;
    }
}
exports.GetBillById = GetBillById;
//# sourceMappingURL=GetBillById.js.map