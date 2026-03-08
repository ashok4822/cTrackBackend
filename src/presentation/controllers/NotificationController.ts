import { Request, Response } from "express";
import { NotificationModel } from "../../infrastructure/models/NotificationModel";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class NotificationController {
    async getNotifications(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
            return res.status(HttpStatus.OK).json(notifications);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            await NotificationModel.findOneAndUpdate({ _id: id, userId }, { read: true });
            return res.status(HttpStatus.OK).json({ message: "Notification marked as read" });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            await NotificationModel.updateMany({ userId, read: false }, { read: true });
            return res.status(HttpStatus.OK).json({ message: "All notifications marked as read" });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async deleteNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            await NotificationModel.findOneAndDelete({ _id: id, userId });
            return res.status(HttpStatus.OK).json({ message: "Notification deleted" });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
