"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRepository = void 0;
const Block_1 = require("../../domain/entities/Block");
const BlockModel_1 = require("../models/BlockModel");
class BlockRepository {
    async findAll() {
        const blocks = await BlockModel_1.BlockModel.find();
        return blocks.map((b) => new Block_1.Block(b.id, b.name, b.capacity, b.occupied, b.createdAt, b.updatedAt));
    }
    async findById(id) {
        const block = await BlockModel_1.BlockModel.findById(id);
        if (!block)
            return null;
        return new Block_1.Block(block.id, block.name, block.capacity, block.occupied, block.createdAt, block.updatedAt);
    }
    async findByName(name) {
        const block = await BlockModel_1.BlockModel.findOne({ name });
        if (!block)
            return null;
        return new Block_1.Block(block.id, block.name, block.capacity, block.occupied, block.createdAt, block.updatedAt);
    }
    async save(block) {
        let savedDoc;
        if (block.id && block.id.match(/^[0-9a-fA-F]{24}$/)) {
            savedDoc = await BlockModel_1.BlockModel.findByIdAndUpdate(block.id, {
                name: block.name,
                capacity: block.capacity,
                occupied: block.occupied,
            }, { new: true });
        }
        else {
            const newBlock = new BlockModel_1.BlockModel({
                name: block.name,
                capacity: block.capacity,
                occupied: block.occupied,
            });
            savedDoc = await newBlock.save();
        }
        return new Block_1.Block(savedDoc.id, savedDoc.name, savedDoc.capacity, savedDoc.occupied, savedDoc.createdAt, savedDoc.updatedAt);
    }
    async updateOccupied(id, count) {
        await BlockModel_1.BlockModel.findByIdAndUpdate(id, { occupied: count });
    }
}
exports.BlockRepository = BlockRepository;
//# sourceMappingURL=BlockRepository.js.map