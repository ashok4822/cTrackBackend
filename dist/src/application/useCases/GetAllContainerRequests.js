"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllContainerRequests = void 0;
const RequestMapper_1 = require("../mappers/RequestMapper");
class GetAllContainerRequests {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        const requests = await this.repository.findAll();
        return RequestMapper_1.RequestMapper.toCollectionResponseDto(requests);
    }
}
exports.GetAllContainerRequests = GetAllContainerRequests;
//# sourceMappingURL=GetAllContainerRequests.js.map