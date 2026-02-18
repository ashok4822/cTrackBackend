import { Block } from "../entities/Block";

export interface IBlockRepository {
    findAll(): Promise<Block[]>;
    findById(id: string): Promise<Block | null>;
    save(block: Block): Promise<Block>;
}
