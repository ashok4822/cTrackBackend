import { Router } from "express";
import { SupportController } from "../controllers/SupportController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware } from "../middlewares/authMiddleware";

export const createSupportRouter = (
    tokenService: ITokenService,
    supportController: SupportController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.post("/chat", authMiddleware, supportController.chat);

    return router;
};
