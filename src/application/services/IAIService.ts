import { ChatMessage } from "../dto/SupportDto";

export interface AIStreamResult {
    textStream: AsyncIterable<string>;
}

export interface IAIService {
    streamChat(messages: ChatMessage[], systemPrompt: string, model?: string): Promise<AIStreamResult>;
}
