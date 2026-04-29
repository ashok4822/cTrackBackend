"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGateOperations = void 0;
const GateMapper_1 = require("../mappers/GateMapper");
class GetGateOperations {
    gateOperationRepository;
    constructor(gateOperationRepository) {
        this.gateOperationRepository = gateOperationRepository;
    }
    async execute(filters) {
        const operations = await this.gateOperationRepository.findAll(filters);
        return GateMapper_1.GateMapper.toCollectionResponseDto(operations);
    }
}
exports.GetGateOperations = GetGateOperations;
//# sourceMappingURL=GetGateOperations.js.map