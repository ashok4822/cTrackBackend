"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportUseCase = void 0;
const CATEGORY_LABELS = {
    containers: "Container & Cargo Operations",
    bills: "Billing & Payments",
    pda: "PDA Wallet Transactions",
    general: "General Yard Overview",
};
class SupportUseCase {
    contextBuilder;
    aiService;
    constructor(contextBuilder, aiService) {
        this.contextBuilder = contextBuilder;
        this.aiService = aiService;
    }
    async execute(data) {
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
        }
        catch (ctxErr) {
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
exports.SupportUseCase = SupportUseCase;
//# sourceMappingURL=SupportUseCase.js.map