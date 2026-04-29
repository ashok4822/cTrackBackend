"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqAIService = void 0;
const groq_1 = require("@ai-sdk/groq");
const ai_1 = require("ai");
class GroqAIService {
    _defaultModel = "llama-3.3-70b-versatile";
    async streamChat(messages, systemPrompt, model) {
        return (0, ai_1.streamText)({
            model: (0, groq_1.groq)(model || this._defaultModel),
            system: systemPrompt,
            messages: (messages || []).map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content || "",
            })),
            maxRetries: 2,
        });
    }
}
exports.GroqAIService = GroqAIService;
//# sourceMappingURL=GroqAIService.js.map