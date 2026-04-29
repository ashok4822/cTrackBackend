"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockDomainService = void 0;
const Block_1 = require("../../domain/entities/Block");
class BlockDomainService {
    blockRepository;
    constructor(blockRepository) {
        this.blockRepository = blockRepository;
    }
    async decrementOccupancy(blockName) {
        return this.updateOccupancy(blockName, -1);
    }
    async incrementOccupancy(blockName) {
        return this.updateOccupancy(blockName, 1);
    }
    async updateOccupancy(blockName, delta) {
        const block = await this.blockRepository.findByName(blockName);
        if (block) {
            const updatedBlock = new Block_1.Block(block.id, block.name, block.capacity, Math.max(0, block.occupied + delta), block.createdAt, new Date());
            await this.blockRepository.save(updatedBlock);
        }
    }
}
exports.BlockDomainService = BlockDomainService;
//# sourceMappingURL=BlockDomainService.js.map