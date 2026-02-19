import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { Block } from "../../domain/entities/Block";

export class GetBlocks {
    constructor(private blockRepository: IBlockRepository) { }

    async execute(): Promise<Block[]> {
        return this.blockRepository.findAll();
    }
}
