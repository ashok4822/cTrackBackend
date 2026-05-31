import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware } from "../middlewares/authMiddleware";

export const createNotificationRouter = (
    tokenService: ITokenService,
    notificationController: NotificationController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get("/", authMiddleware, notificationController.getNotifications);
    router.put("/:id/read", authMiddleware, notificationController.markAsRead);
    router.put("/read-all", authMiddleware, notificationController.markAllAsRead);
    router.delete("/:id", authMiddleware, notificationController.deleteNotification);

    return router;
};
