import { Router } from "express";
import { SupportController } from "../controllers/SupportController";
import { SupportUseCase } from "../../application/useCases/SupportUseCase";
import { AIChatContextBuilder } from "../../application/services/AIChatContextBuilder";
import { GroqAIService } from "../../infrastructure/services/GroqAIService";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createSupportRouter = () => {
    const router = Router();
    
    // Dependencies
    const contextBuilder = new AIChatContextBuilder(
        new ContainerRepository(),
        new ContainerRequestRepository(),
        new BillRepository(),
        new PDARepository()
    );
    const aiService = new GroqAIService();
    const supportUseCase = new SupportUseCase(contextBuilder, aiService);
    const controller = new SupportController(supportUseCase);

    router.post("/chat", authMiddleware, controller.chat);

    return router;
};
