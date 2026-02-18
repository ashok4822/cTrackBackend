import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { Block } from "../../domain/entities/Block";
import { BlockModel } from "../models/BlockModel";

export class BlockRepository implements IBlockRepository {
    async findAll(): Promise<Block[]> {
        const blocks = await BlockModel.find();
        return blocks.map(
            (b) => new Block(b.id, b.name, b.capacity, b.occupied, b.createdAt, b.updatedAt)
        );
    }

    async findById(id: string): Promise<Block | null> {
        const block = await BlockModel.findById(id);
        if (!block) return null;
        return new Block(block.id, block.name, block.capacity, block.occupied, block.createdAt, block.updatedAt);
    }

    async save(block: Block): Promise<Block> {
        let savedDoc;
        if (block.id && block.id.match(/^[0-9a-fA-F]{24}$/)) {
            savedDoc = await BlockModel.findByIdAndUpdate(block.id, {
                name: block.name,
                capacity: block.capacity,
                occupied: block.occupied,
            }, { new: true });
        } else {
            const newBlock = new BlockModel({
                name: block.name,
                capacity: block.capacity,
                occupied: block.occupied,
            });
            savedDoc = await newBlock.save();
        }
        return new Block(savedDoc!.id, savedDoc!.name, savedDoc!.capacity, savedDoc!.occupied, savedDoc!.createdAt, savedDoc!.updatedAt);
    }
}
