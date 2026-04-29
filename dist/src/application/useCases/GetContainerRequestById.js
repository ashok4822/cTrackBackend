"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContainerRequestById = void 0;
const RequestMapper_1 = require("../mappers/RequestMapper");
class GetContainerRequestById {
    containerRequestRepository;
    constructor(containerRequestRepository) {
        this.containerRequestRepository = containerRequestRepository;
    }
    async execute(id) {
        const request = await this.containerRequestRepository.findById(id);
        return request ? RequestMapper_1.RequestMapper.toResponseDto(request) : null;
    }
}
exports.GetContainerRequestById = GetContainerRequestById;
//# sourceMappingURL=GetContainerRequestById.js.map