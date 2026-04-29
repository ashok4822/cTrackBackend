"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YardManagerHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
const Block_1 = require("../../domain/entities/Block");
class YardManagerHandler {
    blockRepository;
    constructor(blockRepository) {
        this.blockRepository = blockRepository;
        this.initialize();
    }
    initialize() {
        // 1. Handle occupancy change from Gate Operations
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.GATE_OPERATION_CREATED, async (data) => {
            try {
                const { operation, data: inputData, updatedContainer } = data;
                // If it's a Gate-Out and the container had a block assigned
                if (inputData.type === "gate-out" && updatedContainer?.yardLocation?.block) {
                    await this.updateOccupancy(updatedContainer.yardLocation.block, -1);
                }
                // Note: Gate-In often doesn't assign a block immediately in this system, 
                // it happens during a subsequent "Update Container" call (Shift operation).
            }
            catch (error) {
                console.error("[YardManagerHandler] Failed to update occupancy for Gate Operation:", error);
            }
        });
        // 2. Handle occupancy change from Container Updates (Shifting)
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CONTAINER_UPDATED, async (data) => {
            try {
                const { oldContainer, newContainer } = data;
                // If block changed
                if (newContainer.yardLocation?.block !== oldContainer.yardLocation?.block) {
                    // Decrement old block
                    if (oldContainer.yardLocation?.block) {
                        await this.updateOccupancy(oldContainer.yardLocation.block, -1);
                    }
                    // Increment new block
                    if (newContainer.yardLocation?.block) {
                        await this.updateOccupancy(newContainer.yardLocation.block, 1);
                    }
                }
            }
            catch (error) {
                console.error("[YardManagerHandler] Failed to update occupancy for Container Update:", error);
            }
        });
    }
    async updateOccupancy(blockName, delta) {
        const block = await this.blockRepository.findByName(blockName);
        if (block) {
            const updatedBlock = new Block_1.Block(block.id, block.name, block.capacity, Math.max(0, block.occupied + delta), block.createdAt, new Date());
            await this.blockRepository.save(updatedBlock);
            console.log(`[YardManagerHandler] Updated occupancy for ${blockName} by ${delta}`);
        }
    }
}
exports.YardManagerHandler = YardManagerHandler;
//# sourceMappingURL=YardManagerHandler.js.map