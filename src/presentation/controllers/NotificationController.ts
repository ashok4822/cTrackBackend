import { Request, Response } from "express";
import { IGetNotifications } from "../../application/ports/IGetNotifications";
import { IMarkNotificationRead } from "../../application/ports/IMarkNotificationRead";
import { IMarkAllNotificationsRead } from "../../application/ports/IMarkAllNotificationsRead";
import { IDeleteNotification } from "../../application/ports/IDeleteNotification";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { AppError } from "../../domain/exceptions/AppError";

export class NotificationController {
    constructor(
        private getNotificationsUseCase: IGetNotifications,
        private markAsReadUseCase: IMarkNotificationRead,
        private markAllAsReadUseCase: IMarkAllNotificationsRead,
        private deleteNotificationUseCase: IDeleteNotification
    ) { }

    getNotifications = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        const notifications = await this.getNotificationsUseCase.execute(userId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(notifications));
    });

    markAsRead = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        await this.markAsReadUseCase.execute(id as string, userId as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.NOTIFICATION_READ));
    });

    markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        await this.markAllAsReadUseCase.execute(userId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.NOTIFICATION_ALL_READ));
    });

    deleteNotification = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        await this.deleteNotificationUseCase.execute(id as string, userId as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.NOTIFICATION_DELETED));
    });
}


