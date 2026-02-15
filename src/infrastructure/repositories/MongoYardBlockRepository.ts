import { IYardBlockRepository } from "../../domain/repositories/IYardBlockRepository";
import { YardBlock } from "../../domain/entities/YardBlock";
import { YardBlockModel } from "../models/YardBlockModel";

export class MongoYardBlockRepository implements IYardBlockRepository {
    async findAll(): Promise<YardBlock[]> {
        const blocks = await YardBlockModel.find();
        return blocks.map(
            (b) => new YardBlock(b.id, b.name, b.capacity, b.occupied)
        );
    }

    async findById(id: string): Promise<YardBlock | null> {
        const block = await YardBlockModel.findById(id);
        if (!block) return null;
        return new YardBlock(block.id, block.name, block.capacity, block.occupied);
    }

    async save(yardBlock: YardBlock): Promise<void> {
        if (yardBlock.id && yardBlock.id.match(/^[0-9a-fA-F]{24}$/)) {
            await YardBlockModel.findByIdAndUpdate(yardBlock.id, {
                name: yardBlock.name,
                capacity: yardBlock.capacity,
                occupied: yardBlock.occupied,
            });
        } else {
            const newBlock = new YardBlockModel({
                name: yardBlock.name,
                capacity: yardBlock.capacity,
                occupied: yardBlock.occupied,
            });
            await newBlock.save();
        }
    }
}
