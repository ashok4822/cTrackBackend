"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupportRouter = void 0;
const express_1 = require("express");
const SupportController_1 = require("../controllers/SupportController");
const SupportUseCase_1 = require("../../application/useCases/SupportUseCase");
const AIChatContextBuilder_1 = require("../../application/services/AIChatContextBuilder");
const GroqAIService_1 = require("../../infrastructure/services/GroqAIService");
const ContainerRepository_1 = require("../../infrastructure/repositories/ContainerRepository");
const ContainerRequestRepository_1 = require("../../infrastructure/repositories/ContainerRequestRepository");
const BillRepository_1 = require("../../infrastructure/repositories/BillRepository");
const PDARepository_1 = require("../../infrastructure/repositories/PDARepository");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const createSupportRouter = () => {
    const router = (0, express_1.Router)();
    // Dependencies
    const contextBuilder = new AIChatContextBuilder_1.AIChatContextBuilder(new ContainerRepository_1.ContainerRepository(), new ContainerRequestRepository_1.ContainerRequestRepository(), new BillRepository_1.BillRepository(), new PDARepository_1.PDARepository());
    const aiService = new GroqAIService_1.GroqAIService();
    const supportUseCase = new SupportUseCase_1.SupportUseCase(contextBuilder, aiService);
    const controller = new SupportController_1.SupportController(supportUseCase);
    router.post("/chat", authMiddleWare_1.authMiddleware, controller.chat);
    return router;
};
exports.createSupportRouter = createSupportRouter;
//# sourceMappingURL=supportRoutes.js.map