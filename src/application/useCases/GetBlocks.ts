import { IGetBlocks } from "../ports/IGetBlocks";
import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { BlockCollectionResponseDto } from "../dto/YardDto";
import { YardMapper } from "../mappers/YardMapper";

export class GetBlocks implements IGetBlocks {
    constructor(private readonly _blockRepository: IBlockRepository) { }

    async execute(): Promise<BlockCollectionResponseDto> {
        const blocks = await this._blockRepository.findAll();
        return YardMapper.toCollectionResponseDto(blocks);
    }
}
