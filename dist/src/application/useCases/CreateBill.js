"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBill = void 0;
const BillingMapper_1 = require("../mappers/BillingMapper");
class CreateBill {
    billRepository;
    constructor(billRepository) {
        this.billRepository = billRepository;
    }
    async execute(data) {
        const bill = BillingMapper_1.BillingMapper.toEntity(data);
        const savedBill = await this.billRepository.save(bill);
        return BillingMapper_1.BillingMapper.toResponseDto(savedBill);
    }
}
exports.CreateBill = CreateBill;
//# sourceMappingURL=CreateBill.js.map