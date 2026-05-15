import { Router } from "express";
import { SupportController } from "../controllers/SupportController";
import { SupportUseCase } from "../../application/useCases/SupportUseCase";
import { AIChatContextBuilder } from "../../application/services/AIChatContextBuilder";
import { GroqAIService } from "../../infrastructure/services/GroqAIService";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { createAuthMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createSupportRouter = (
    tokenService: ITokenService,
    config: IConfigService
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    // Dependencies
    const contextBuilder = new AIChatContextBuilder(
        new ContainerRepository(),
        new ContainerRequestRepository(),
        new BillRepository(),
        new PDARepository()
    );
    const aiService = new GroqAIService(config);
    const supportUseCase = new SupportUseCase(contextBuilder, aiService);
    const controller = new SupportController(supportUseCase, config);

    router.post("/chat", authMiddleware, controller.chat);

    return router;
};
