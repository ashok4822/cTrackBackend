"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomerRequests = void 0;
const RequestMapper_1 = require("../mappers/RequestMapper");
class GetCustomerRequests {
    containerRequestRepository;
    constructor(containerRequestRepository) {
        this.containerRequestRepository = containerRequestRepository;
    }
    async execute(customerId) {
        const requests = await this.containerRequestRepository.findByCustomerId(customerId);
        return RequestMapper_1.RequestMapper.toCollectionResponseDto(requests);
    }
}
exports.GetCustomerRequests = GetCustomerRequests;
//# sourceMappingURL=GetCustomerRequests.js.map