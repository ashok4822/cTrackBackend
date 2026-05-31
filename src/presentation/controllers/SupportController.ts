import { Request, Response } from "express";
import { ISupportUseCase } from "../../application/ports/ISupportUseCase";
import { ChatCategory, ChatMessage } from "../../application/dto/SupportDto";
import { IConfigService } from "../../application/services/IConfigService";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { asyncHandler } from "../middlewares/asyncHandler";

export class SupportController {
    constructor(
        private readonly _supportUseCase: ISupportUseCase,
        private readonly _configService: IConfigService
    ) { }

    chat = asyncHandler(async (req: Request, res: Response) => {
        const { messages, category = "general" } = req.body as { messages: ChatMessage[]; category?: ChatCategory };
        const user = req.user;

        // Configuration check is now implicitly handled by configService or at startup
        this._configService.get("GROQ_API_KEY");

        const result = await this._supportUseCase.execute({

            messages,
            category,
            user: user ? {
                id: user.id,
                name: user.name,
                companyName: user.companyName
            } : undefined
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("X-Vercel-AI-Data-Stream", "v1");

        try {
            for await (const chunk of result.textStream) {
                const line = `0:${JSON.stringify(chunk)}\n`;
                res.write(line);
            }
        } catch (streamError: unknown) {
            console.error("!!! Error during AI streaming loop !!!", streamError);

            let userErrorMessage = "The AI service is currently unavailable.";
            const errorMsg = streamError instanceof Error ? streamError.message : "";
            
            if (errorMsg.includes(HttpStatus.TOO_MANY_REQUESTS.toString()) || errorMsg.includes("quota")) {

                userErrorMessage = "AI Quota Exceeded. Please try again in 1 minute.";
            } else if (errorMsg.includes(HttpStatus.NOT_FOUND.toString()) || errorMsg.includes("not found")) {

                userErrorMessage = "AI Model not available for this API key. Please check configuration.";
            } else if (errorMsg) {
                userErrorMessage = `AI Error: ${errorMsg}`;
            }

            const errorLine = `3:${JSON.stringify({ message: userErrorMessage })}\n`;
            res.write(errorLine);
        }

        res.end();
    });
}


