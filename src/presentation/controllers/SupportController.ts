import { Request, Response } from "express";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { AIChatContextBuilder } from "../../application/services/AIChatContextBuilder";

type ChatCategory = "containers" | "bills" | "pda" | "general";

const CATEGORY_LABELS: Record<ChatCategory, string> = {
    containers: "Container & Cargo Operations",
    bills: "Billing & Payments",
    pda: "PDA Wallet Transactions",
    general: "General Yard Overview",
};

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export class SupportController {
    async chat(req: Request, res: Response) {
        try {
            console.log(">>> AI CHAT REQUEST RECEIVED (GROQ) <<<");

            const { messages, category = "general" } = req.body as { messages: ChatMessage[]; category?: ChatCategory };
            const user = req.user;
            const customerId = user?.id || "";
            const userId = user?.id || "";

            console.log(`[AI Chat] User: ${user?.name || "Unknown"} (${user?.companyName || "No Company"})`);
            console.log(`[AI Chat] Category: ${category}`);

            if (!process.env.GROQ_API_KEY) {
                console.error("!!! CRITICAL ERROR: GROQ_API_KEY MISSING !!!");
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "AI Service Configuration Error" });
            }

            // Build context string from DB based on selected category
            let contextData = "";
            try {
                switch (category) {
                    case "containers":
                        contextData = await AIChatContextBuilder.buildContainerContext(customerId);
                        break;
                    case "bills":
                        contextData = await AIChatContextBuilder.buildBillContext(customerId);
                        break;
                    case "pda":
                        contextData = await AIChatContextBuilder.buildPDAContext(userId);
                        break;
                    case "general":
                    default:
                        contextData = await AIChatContextBuilder.buildGeneralContext(customerId, userId);
                        break;
                }
                console.log(`[AI Chat] Context built for category "${category}": ${contextData.length} chars`);
            } catch (ctxErr: unknown) {
                const errorMessage = ctxErr instanceof Error ? ctxErr.message : "Unknown error";
                console.error("[AI Chat] Failed to build context:", errorMessage);
                contextData = "(Context data temporarily unavailable. Answer based on general knowledge.)";
            }

            const systemPrompt = `
You are the cTrack Assistant, a professional logistics and yard management AI expert.
You are currently answering questions in the "${CATEGORY_LABELS[category as ChatCategory] || "General"}" category.

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

            const modelSelected = "llama-3.3-70b-versatile";
            console.log(`[AI Chat] Initializing Groq stream with model: ${modelSelected}`);

            const result = streamText({
                model: groq(modelSelected),
                system: systemPrompt,
                messages: (messages || []).map((m: ChatMessage) => ({
                    role: m.role === "user" ? "user" : "assistant",
                    content: m.content || "",
                })),
                maxRetries: 2,
            });

            console.log("[AI Chat] Groq stream initialized successfully.");

            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.setHeader("Transfer-Encoding", "chunked");
            res.setHeader("X-Vercel-AI-Data-Stream", "v1");

            try {
                for await (const chunk of result.textStream) {
                    const line = `0:${JSON.stringify(chunk)}\n`;
                    process.stdout.write(chunk);
                    res.write(line);
                }
            } catch (streamError: unknown) {
                console.error("!!! Error during AI streaming loop !!!", streamError);

                let userErrorMessage = "The AI service is currently unavailable.";
                const errorMsg = streamError instanceof Error ? streamError.message : "";
                
                if (errorMsg.includes("429") || errorMsg.includes("quota")) {
                    userErrorMessage = "AI Quota Exceeded. Please try again in 1 minute.";
                } else if (errorMsg.includes("404") || errorMsg.includes("not found")) {
                    userErrorMessage = "AI Model not available for this API key. Please check configuration.";
                } else if (errorMsg) {
                    userErrorMessage = `AI Error: ${errorMsg}`;
                }

                const errorLine = `3:${JSON.stringify({ message: userErrorMessage })}\n`;
                res.write(errorLine);
            }

            console.log("\n[AI Chat] Stream completed.");
            res.end();
        } catch (error: unknown) {
            console.error("AI Chat Error:", error);
            if (!res.headersSent) {
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to process AI request" });
            }
        }
    }
}
