import { Request, Response } from "express";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class SupportController {
    async chat(req: Request, res: Response) {
        try {
            const { messages, kpiData } = req.body;
            const user = (req as any).user;

            const systemPrompt = `
You are the cTrack Assistant, a professional logistics and yard management expert.
Your goal is to help customers understand their yard operations and billing.

CUSTOMER CONTEXT:
- Name: ${user?.name || 'Customer'}
- Company: ${user?.companyName || 'Not specified'}

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

            const result = streamText({
                model: google("gemini-2.0-flash"),
                system: systemPrompt,
                messages: messages.map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'assistant',
                    content: m.content,
                })),
            });

            // Stream response manually using textStream async iterable.
            // Format as Vercel AI data stream protocol: lines of `0:"chunk"\n`
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.setHeader('X-Vercel-AI-Data-Stream', 'v1');

            for await (const chunk of result.textStream) {
                const line = `0:${JSON.stringify(chunk)}\n`;
                res.write(line);
            }

            res.end();
        } catch (error: any) {
            console.error("AI Chat Error:", error);
            if (!res.headersSent) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to process AI request" });
            }
        }
    }
}
