import { Request, Response } from "express";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class SupportController {
  async chat(req: Request, res: Response) {
    try {
      console.log(">>> AI CHAT REQUEST RECEIVED (GROQ) <<<");
      console.log("Headers:", JSON.stringify(req.headers));
      console.log(
        "Body excerpt:",
        JSON.stringify(
          { ...req.body, messages: req.body.messages?.length },
          null,
          2,
        ),
      );

      const { messages, kpiData } = req.body;
      const user = (req as any).user;

      console.log(
        `[AI Chat] User: ${user?.name || "Unknown"} (${user?.companyName || "No Company"})`,
      );
      console.log(`[AI Chat] KPI Data keys:`, Object.keys(kpiData || {}));

      const systemPrompt = `
You are the cTrack Assistant, a professional logistics and yard management expert.
Your goal is to help customers understand their yard operations and billing.

CUSTOMER CONTEXT:
- Name: ${user?.name || "Customer"}
- Company: ${user?.companyName || "Not specified"}

CURRENT YARD & FINANCIAL DATA:
- Total Containers in Yard: ${kpiData?.totalContainersInYard || 0}
- Containers in Transit: ${kpiData?.containersInTransit || 0}
- Gate-In Today: ${kpiData?.gateInToday || 0}
- Gate-Out Today: ${kpiData?.gateOutToday || 0}
- PDA Balance: ₹${(kpiData?.pdaBalance || 0).toLocaleString()}
- Unpaid Bills: ₹${(kpiData?.unpaidBillsAmount || 0).toLocaleString()}
- Yard Utilization: ${kpiData?.yardUtilization || 0}%

GUIDELINES:
1. Be concise and professional.
2. Use the "Current Yard & Financial Data" to answer specific questions accurately.
3. If asked about payments, mention that they can pay in the Bills section or recharge their PDA.
4. If you don't know something about a specific container, ask for its container number.
5. Our terminal operates 24/7. Support can be reached at support@ctrack.io.
6. Format responses in markdown. Use bold for numbers and currency.
`;

      if (!process.env.GROQ_API_KEY) {
        console.error("!!! CRITICAL ERROR: GROQ_API_KEY MISSING !!!");
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "AI Service Configuration Error" });
      }

      const apiKey = process.env.GROQ_API_KEY || "";
      console.log(
        `[AI Chat] Active Groq API Key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`,
      );

      const modelSelected = "llama-3.3-70b-versatile";

      console.log(
        `[AI Chat] Initializing Groq stream with model: ${modelSelected}`,
      );
      const result = streamText({
        model: groq(modelSelected),
        system: systemPrompt,
        messages: (messages || []).map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content || "",
        })),
        maxRetries: 2,
      });
      console.log("[AI Chat] Groq stream initialized successfully.");

      // Stream response manually using textStream async iterable.
      // Format as Vercel AI data stream protocol: lines of `0:"chunk"\n`
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("X-Vercel-AI-Data-Stream", "v1");

      try {
        for await (const chunk of result.textStream) {
          const line = `0:${JSON.stringify(chunk)}\n`;
          process.stdout.write(chunk); // Stream chunk to server log
          res.write(line);
        }
      } catch (streamError: any) {
        console.error("!!! Error during AI streaming loop !!!", streamError);

        let userErrorMessage = "The AI service is currently unavailable.";
        if (
          streamError.message?.includes("429") ||
          streamError.message?.includes("quota")
        ) {
          userErrorMessage = "AI Quota Exceeded. Please try again in 1 minute.";
        } else if (
          streamError.message?.includes("404") ||
          streamError.message?.includes("not found")
        ) {
          userErrorMessage =
            "AI Model not available for this API key. Please check configuration.";
        } else if (streamError.message) {
          userErrorMessage = `AI Error: ${streamError.message}`;
        }

        const errorLine = `3:${JSON.stringify({ message: userErrorMessage })}\n`;
        res.write(errorLine);
      }

      console.log("\n[AI Chat] Stream completed.");
      res.end();
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      if (!res.headersSent) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to process AI request" });
      }
    }
  }
}
