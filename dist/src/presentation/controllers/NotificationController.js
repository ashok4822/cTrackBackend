"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const AppError_1 = require("../../domain/exceptions/AppError");
class NotificationController {
    getNotificationsUseCase;
    markAsReadUseCase;
    markAllAsReadUseCase;
    deleteNotificationUseCase;
    constructor(getNotificationsUseCase, markAsReadUseCase, markAllAsReadUseCase, deleteNotificationUseCase) {
        this.getNotificationsUseCase = getNotificationsUseCase;
        this.markAsReadUseCase = markAsReadUseCase;
        this.markAllAsReadUseCase = markAllAsReadUseCase;
        this.deleteNotificationUseCase = deleteNotificationUseCase;
    }
    getNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const notifications = await this.getNotificationsUseCase.execute(userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(notifications));
    });
    markAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        await this.markAsReadUseCase.execute(id, userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.NOTIFICATION_READ));
    });
    markAllAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        await this.markAllAsReadUseCase.execute(userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.NOTIFICATION_ALL_READ));
    });
    deleteNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        await this.deleteNotificationUseCase.execute(id, userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.NOTIFICATION_DELETED));
    });
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map