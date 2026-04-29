import { IAIChatContextBuilder } from "../ports/IAIChatContextBuilder";
import { ISupportUseCase } from "../ports/ISupportUseCase";
import { SupportChatRequestDto, SupportChatStreamResponseDto } from "../dto/SupportDto";
import { IAIService } from "../services/IAIService";

const CATEGORY_LABELS: Record<string, string> = {
    containers: "Container & Cargo Operations",
    bills: "Billing & Payments",
    pda: "PDA Wallet Transactions",
    general: "General Yard Overview",
};

export class SupportUseCase implements ISupportUseCase {
    constructor(
        private contextBuilder: IAIChatContextBuilder,
        private aiService: IAIService
    ) { }

    async execute(data: SupportChatRequestDto): Promise<SupportChatStreamResponseDto> {

        const { messages, category, user } = data;
        const customerId = user?.id || "";
        const userId = user?.id || "";

        // Build context string from DB based on selected category
        let contextData = "";
        try {
            switch (category) {
                case "containers":
                    contextData = await this.contextBuilder.buildContainerContext(customerId);
                    break;
                case "bills":
                    contextData = await this.contextBuilder.buildBillContext(customerId);
                    break;
                case "pda":
                    contextData = await this.contextBuilder.buildPDAContext(userId);
                    break;
                case "general":
                default:
                    contextData = await this.contextBuilder.buildGeneralContext(customerId, userId);
                    break;
            }
        } catch (ctxErr: unknown) {
            console.error("[AI Chat] Failed to build context:", ctxErr);
            contextData = "(Context data temporarily unavailable. Answer based on general knowledge.)";
        }

        const systemPrompt = `
You are the cTrack Assistant, a professional logistics and yard management AI expert.
You are currently answering questions in the "${CATEGORY_LABELS[category] || "General"}" category.

CUSTOMER IDENTITY:
- Name: ${user?.name || "Customer"}
- Company: ${user?.companyName || "Not specified"}

LIVE DATA FROM DATABASE:
${contextData}

GUIDELINES:
1. Be concise, professional, and accurate. Use ONLY the data above for factual answers.
2. Format responses in markdown. Use **bold** for container numbers, amounts, and important values.
3. If asked something outside the current category, briefly answer and suggest the customer switch to the relevant category.
4. For payments: direct the customer to the Bills section or PDA recharge page.
5. If a specific record is not found in the data above, say so clearly — do not guess or fabricate.
6. Terminal operates 24/7. Support: support@ctrack.io
`.trim();

        return this.aiService.streamChat(messages, systemPrompt);
    }
}
