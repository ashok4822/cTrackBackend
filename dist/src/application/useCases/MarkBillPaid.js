"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkBillPaid = void 0;
const BillingMapper_1 = require("../mappers/BillingMapper");
class MarkBillPaid {
    billRepository;
    constructor(billRepository) {
        this.billRepository = billRepository;
    }
    async execute(id) {
        const bill = await this.billRepository.update(id, { status: "paid", paidAt: new Date() });
        return bill ? BillingMapper_1.BillingMapper.toResponseDto(bill) : null;
    }
}
exports.MarkBillPaid = MarkBillPaid;
//# sourceMappingURL=MarkBillPaid.js.map