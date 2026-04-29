import { CreateBlockRequestDto, BlockResponseDto } from "../dto/YardDto";
import { UserContextDto } from "../dto/CommonDto";

export interface ICreateBlock {
    execute(data: CreateBlockRequestDto, userContext: UserContextDto): Promise<BlockResponseDto>;
}
