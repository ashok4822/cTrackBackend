"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationRouter = void 0;
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const GetNotifications_1 = require("../../application/useCases/GetNotifications");
const MarkNotificationRead_1 = require("../../application/useCases/MarkNotificationRead");
const MarkAllNotificationsRead_1 = require("../../application/useCases/MarkAllNotificationsRead");
const DeleteNotification_1 = require("../../application/useCases/DeleteNotification");
const MongoNotificationRepository_1 = require("../../infrastructure/repositories/MongoNotificationRepository");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const createNotificationRouter = () => {
    const router = (0, express_1.Router)();
    const notificationRepository = new MongoNotificationRepository_1.MongoNotificationRepository();
    const getNotificationsUseCase = new GetNotifications_1.GetNotifications(notificationRepository);
    const markNotificationReadUseCase = new MarkNotificationRead_1.MarkNotificationRead(notificationRepository);
    const markAllNotificationsReadUseCase = new MarkAllNotificationsRead_1.MarkAllNotificationsRead(notificationRepository);
    const deleteNotificationUseCase = new DeleteNotification_1.DeleteNotification(notificationRepository);
    const controller = new NotificationController_1.NotificationController(getNotificationsUseCase, markNotificationReadUseCase, markAllNotificationsReadUseCase, deleteNotificationUseCase);
    router.get("/", authMiddleWare_1.authMiddleware, controller.getNotifications);
    router.put("/:id/read", authMiddleWare_1.authMiddleware, controller.markAsRead);
    router.put("/read-all", authMiddleWare_1.authMiddleware, controller.markAllAsRead);
    router.delete("/:id", authMiddleWare_1.authMiddleware, controller.deleteNotification);
    return router;
};
exports.createNotificationRouter = createNotificationRouter;
//# sourceMappingURL=notificationRoutes.js.map