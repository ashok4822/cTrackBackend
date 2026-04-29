import { UpdateBlockRequestDto, BlockResponseDto } from "../dto/YardDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IUpdateBlock {
    execute(
        id: string, 
        data: UpdateBlockRequestDto, 
        userContext: UserContextDto
    ): Promise<BlockResponseDto>;
}
