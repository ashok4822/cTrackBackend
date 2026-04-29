"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
class SupportController {
    supportUseCase;
    constructor(supportUseCase) {
        this.supportUseCase = supportUseCase;
    }
    chat = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { messages, category = "general" } = req.body;
        const user = req.user;
        if (!process.env.GROQ_API_KEY) {
            console.error("!!! CRITICAL ERROR: GROQ_API_KEY MISSING !!!");
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.AI_CONFIG_ERROR, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const result = await this.supportUseCase.execute({
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
        }
        catch (streamError) {
            console.error("!!! Error during AI streaming loop !!!", streamError);
            let userErrorMessage = "The AI service is currently unavailable.";
            const errorMsg = streamError instanceof Error ? streamError.message : "";
            if (errorMsg.includes(HttpStatus_1.HttpStatus.TOO_MANY_REQUESTS.toString()) || errorMsg.includes("quota")) {
                userErrorMessage = "AI Quota Exceeded. Please try again in 1 minute.";
            }
            else if (errorMsg.includes(HttpStatus_1.HttpStatus.NOT_FOUND.toString()) || errorMsg.includes("not found")) {
                userErrorMessage = "AI Model not available for this API key. Please check configuration.";
            }
            else if (errorMsg) {
                userErrorMessage = `AI Error: ${errorMsg}`;
            }
            const errorLine = `3:${JSON.stringify({ message: userErrorMessage })}\n`;
            res.write(errorLine);
        }
        res.end();
    });
}
exports.SupportController = SupportController;
//# sourceMappingURL=SupportController.js.map