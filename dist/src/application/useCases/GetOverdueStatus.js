"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOverdueStatus = void 0;
class GetOverdueStatus {
    _billRepository;
    constructor(_billRepository) {
        this._billRepository = _billRepository;
    }
    async execute(customerId) {
        const bills = await this._billRepository.findAll(customerId);
        return bills.some((bill) => bill.status === "overdue");
    }
}
exports.GetOverdueStatus = GetOverdueStatus;
//# sourceMappingURL=GetOverdueStatus.js.map