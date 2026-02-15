import { IYardBlockRepository } from "../../domain/repositories/IYardBlockRepository";
import { YardBlock } from "../../domain/entities/YardBlock";

export class GetYardBlocks {
    constructor(private yardBlockRepository: IYardBlockRepository) { }

    async execute(): Promise<YardBlock[]> {
        return this.yardBlockRepository.findAll();
    }
}
