"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncYardOccupancy = void 0;
const YardMapper_1 = require("../mappers/YardMapper");
class SyncYardOccupancy {
    blockRepository;
    containerRepository;
    constructor(blockRepository, containerRepository) {
        this.blockRepository = blockRepository;
        this.containerRepository = containerRepository;
    }
    async execute() {
        const blocks = await this.blockRepository.findAll();
        const results = [];
        for (const block of blocks) {
            const containerCount = await this.containerRepository.countByBlockNameAndStatuses(block.name, ['gate-in', 'in-yard', 'damaged']);
            const oldOccupied = block.occupied;
            await this.blockRepository.updateOccupied(block.id, containerCount);
            results.push({
                block: block.name,
                oldOccupied,
                newOccupied: containerCount
            });
        }
        return YardMapper_1.YardMapper.toSyncResponseDto("Yard occupancy synchronized successfully", results);
    }
}
exports.SyncYardOccupancy = SyncYardOccupancy;
//# sourceMappingURL=SyncYardOccupancy.js.map