import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { IAIService, AIStreamResult } from "../../application/services/IAIService";
import { ChatMessage } from "../../application/dto/SupportDto";
import { IConfigService } from "../../application/services/IConfigService";

export class GroqAIService implements IAIService {
    private readonly _defaultModel: string;
    private readonly groqClient: ReturnType<typeof createGroq>;

    constructor(configService: IConfigService) {
        const apiKey = configService.get("GROQ_API_KEY");
        this._defaultModel = "llama-3.3-70b-versatile";
        this.groqClient = createGroq({ apiKey });
    }

    async streamChat(messages: ChatMessage[], systemPrompt: string, model?: string): Promise<AIStreamResult> {
        return streamText({
            model: this.groqClient(model || this._defaultModel),
            system: systemPrompt,
            messages: (messages || []).map((m: ChatMessage) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content || "",
            })),
            maxRetries: 2,
        }) as unknown as AIStreamResult;
    }
}
