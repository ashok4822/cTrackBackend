import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { Block } from "../../domain/entities/Block";

import { IBlockDomainService } from "./IBlockDomainService";

export class BlockDomainService implements IBlockDomainService {
  constructor(private blockRepository: IBlockRepository) {}

  async decrementOccupancy(blockName: string): Promise<void> {
    return this.updateOccupancy(blockName, -1);
  }

  async incrementOccupancy(blockName: string): Promise<void> {
    return this.updateOccupancy(blockName, 1);
  }

  async updateOccupancy(blockName: string, delta: number): Promise<void> {
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
    }
  }
}
