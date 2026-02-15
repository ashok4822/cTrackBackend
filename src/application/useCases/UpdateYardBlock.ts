import { IYardBlockRepository } from "../../domain/repositories/IYardBlockRepository";
import { YardBlock } from "../../domain/entities/YardBlock";

interface UpdateYardBlockData {
    name?: string;
    capacity?: number;
}

export class UpdateYardBlock {
    constructor(private yardBlockRepository: IYardBlockRepository) { }

    async execute(id: string, data: UpdateYardBlockData): Promise<void> {
        const block = await this.yardBlockRepository.findById(id);
        if (!block) {
            throw new Error("Yard block not found");
        }

        const updatedBlock = new YardBlock(
            block.id,
            data.name !== undefined ? data.name : block.name,
            data.capacity !== undefined ? data.capacity : block.capacity,
            block.occupied
        );

        await this.yardBlockRepository.save(updatedBlock);
    }
}
