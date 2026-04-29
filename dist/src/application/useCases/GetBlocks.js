"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlocks = void 0;
const YardMapper_1 = require("../mappers/YardMapper");
class GetBlocks {
    blockRepository;
    constructor(blockRepository) {
        this.blockRepository = blockRepository;
    }
    async execute() {
        const blocks = await this.blockRepository.findAll();
        return YardMapper_1.YardMapper.toCollectionResponseDto(blocks);
    }
}
exports.GetBlocks = GetBlocks;
//# sourceMappingURL=GetBlocks.js.map