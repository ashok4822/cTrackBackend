import { Router, Request, Response } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createNotificationRouter = () => {
    const router = Router();
    const controller = new NotificationController();

    router.get("/", authMiddleware, (req: Request, res: Response) => controller.getNotifications(req, res));
    router.put("/:id/read", authMiddleware, (req: Request, res: Response) => controller.markAsRead(req, res));
    router.put("/read-all", authMiddleware, (req: Request, res: Response) => controller.markAllAsRead(req, res));
    router.delete("/:id", authMiddleware, (req: Request, res: Response) => controller.deleteNotification(req, res));

    return router;
};
