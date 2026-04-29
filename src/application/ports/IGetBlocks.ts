import { BlockCollectionResponseDto } from "../dto/YardDto";

export interface IGetBlocks {
    execute(): Promise<BlockCollectionResponseDto>;
}
