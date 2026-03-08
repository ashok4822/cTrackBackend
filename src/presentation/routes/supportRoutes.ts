import { Router, Request, Response } from "express";
import { SupportController } from "../controllers/SupportController";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createSupportRouter = () => {
    const router = Router();
    const controller = new SupportController();

    router.post("/chat", authMiddleware, (req: Request, res: Response) => controller.chat(req, res));

    return router;
};
