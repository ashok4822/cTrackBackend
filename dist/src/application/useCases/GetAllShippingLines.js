"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllShippingLines = void 0;
const ShippingLineMapper_1 = require("../mappers/ShippingLineMapper");
class GetAllShippingLines {
    shippingLineRepository;
    constructor(shippingLineRepository) {
        this.shippingLineRepository = shippingLineRepository;
    }
    async execute() {
        const shippingLines = await this.shippingLineRepository.findAll();
        return ShippingLineMapper_1.ShippingLineMapper.toCollectionResponseDto(shippingLines);
    }
}
exports.GetAllShippingLines = GetAllShippingLines;
//# sourceMappingURL=GetAllShippingLines.js.map