import { SupportChatRequestDto, SupportChatStreamResponseDto } from "../dto/SupportDto";

export interface ISupportUseCase {
    execute(data: SupportChatRequestDto): Promise<SupportChatStreamResponseDto>;
}


