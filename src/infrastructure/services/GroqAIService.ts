import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { IAIService, AIStreamResult } from "../../application/services/IAIService";
import { ChatMessage } from "../../application/dto/SupportDto";

export class GroqAIService implements IAIService {
    private _defaultModel = "llama-3.3-70b-versatile";

    async streamChat(messages: ChatMessage[], systemPrompt: string, model?: string): Promise<AIStreamResult> {
        return streamText({
            model: groq(model || this._defaultModel),
            system: systemPrompt,
            messages: (messages || []).map((m: ChatMessage) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content || "",
            })),
            maxRetries: 2,
        }) as unknown as AIStreamResult;
    }
}
