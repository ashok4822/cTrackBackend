import { DomainEvents } from "../../domain/events/IEventBus";
import { eventBus } from "./EventEmitterBus";
import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { Block } from "../../domain/entities/Block";
import { GateOperationCreatedPayload, ContainerUpdatedPayload } from "../../types/eventPayloads";

export class YardManagerHandler {
    constructor(private blockRepository: IBlockRepository) {
        this.initialize();
    }

    private initialize() {
        // 1. Handle occupancy change from Gate Operations
        eventBus.on(DomainEvents.GATE_OPERATION_CREATED, async (data: GateOperationCreatedPayload) => {
            try {
                const { operation, data: inputData, updatedContainer } = data;
                
                // If it's a Gate-Out and the container had a block assigned
                if (inputData.type === "gate-out" && updatedContainer?.yardLocation?.block) {
                    await this.updateOccupancy(updatedContainer.yardLocation.block, -1);
                }
                
                // Note: Gate-In often doesn't assign a block immediately in this system, 
                // it happens during a subsequent "Update Container" call (Shift operation).
            } catch (error) {
                console.error("[YardManagerHandler] Failed to update occupancy for Gate Operation:", error);
            }
        });

        // 2. Handle occupancy change from Container Updates (Shifting)
        eventBus.on(DomainEvents.CONTAINER_UPDATED, async (data: ContainerUpdatedPayload) => {
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
            } catch (error) {
                console.error("[YardManagerHandler] Failed to update occupancy for Container Update:", error);
            }
        });
    }

    private async updateOccupancy(blockName: string, delta: number) {
        const block = await this.blockRepository.findByName(blockName);
        if (block) {
            const updatedBlock = new Block(
                block.id,
                block.name,
                block.capacity,
                Math.max(0, block.occupied + delta),
                block.createdAt,
                new Date()
            );
            await this.blockRepository.save(updatedBlock);
            console.log(`[YardManagerHandler] Updated occupancy for ${blockName} by ${delta}`);
        }
    }
}
