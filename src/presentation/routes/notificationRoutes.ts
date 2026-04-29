import { Router, Request, Response } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { GetNotifications } from "../../application/useCases/GetNotifications";
import { MarkNotificationRead } from "../../application/useCases/MarkNotificationRead";
import { MarkAllNotificationsRead } from "../../application/useCases/MarkAllNotificationsRead";
import { DeleteNotification } from "../../application/useCases/DeleteNotification";
import { MongoNotificationRepository } from "../../infrastructure/repositories/MongoNotificationRepository";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createNotificationRouter = () => {
    const router = Router();

    const notificationRepository = new MongoNotificationRepository();

    const getNotificationsUseCase = new GetNotifications(notificationRepository);
    const markNotificationReadUseCase = new MarkNotificationRead(notificationRepository);
    const markAllNotificationsReadUseCase = new MarkAllNotificationsRead(notificationRepository);
    const deleteNotificationUseCase = new DeleteNotification(notificationRepository);

    const controller = new NotificationController(
        getNotificationsUseCase,
        markNotificationReadUseCase,
        markAllNotificationsReadUseCase,
        deleteNotificationUseCase
    );

    router.get("/", authMiddleware, controller.getNotifications);
    router.put("/:id/read", authMiddleware, controller.markAsRead);
    router.put("/read-all", authMiddleware, controller.markAllAsRead);
    router.delete("/:id", authMiddleware, controller.deleteNotification);

    return router;
};
