"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
class Block {
    id;
    name;
    capacity;
    occupied;
    createdAt;
    updatedAt;
    constructor(id, name, capacity, occupied, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.occupied = occupied;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Block = Block;
//# sourceMappingURL=Block.js.map