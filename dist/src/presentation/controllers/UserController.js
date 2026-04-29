"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
const userContext_1 = require("../utils/userContext");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class UserController {
    adminCreateUserUseCase;
    getUserProfileUseCase;
    updateUserProfileUseCase;
    updatePasswordUseCase;
    updateProfileImageUseCase;
    getAllUsersUseCase;
    toggleUserBlockStatusUseCase;
    adminUpdateUserUseCase;
    constructor(adminCreateUserUseCase, getUserProfileUseCase, updateUserProfileUseCase, updatePasswordUseCase, updateProfileImageUseCase, getAllUsersUseCase, toggleUserBlockStatusUseCase, adminUpdateUserUseCase) {
        this.adminCreateUserUseCase = adminCreateUserUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.updatePasswordUseCase = updatePasswordUseCase;
        this.updateProfileImageUseCase = updateProfileImageUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.toggleUserBlockStatusUseCase = toggleUserBlockStatusUseCase;
        this.adminUpdateUserUseCase = adminUpdateUserUseCase;
    }
    createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, role, name } = req.body;
        const userContext = (0, userContext_1.extractUserContext)(req);
        const result = await this.adminCreateUserUseCase.execute({ email, role, name, userContext });
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(result, ResponseMessage_1.ResponseMessage.CREATE_SUCCESS));
    });
    getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        const user = await this.getUserProfileUseCase.execute(userId);
        if (!user)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(user));
    });
    updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        const { name, phone, companyName } = req.body;
        const userContext = (0, userContext_1.extractUserContext)(req);
        const updatedUser = await this.updateUserProfileUseCase.execute(userId, { name, phone, companyName }, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updatedUser, ResponseMessage_1.ResponseMessage.PROFILE_UPDATE_SUCCESS));
    });
    updatePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.PASSWORD_MISMATCH, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this.updatePasswordUseCase.execute(userId, currentPassword, newPassword, confirmPassword, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.PASSWORD_UPDATE_SUCCESS));
    });
    updateProfileImage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        if (!req.file)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.NO_FILE_UPLOADED, HttpStatus_1.HttpStatus.BAD_REQUEST);
        const imageUrl = req.file.path;
        const updatedUser = await this.updateProfileImageUseCase.execute(userId, imageUrl);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success({ profileImage: updatedUser.profileImage }, ResponseMessage_1.ResponseMessage.PROFILE_IMAGE_UPDATE_SUCCESS));
    });
    getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await this.getAllUsersUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result));
    });
    toggleBlockStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userContext = (0, userContext_1.extractUserContext)(req);
        const result = await this.toggleUserBlockStatusUseCase.execute(id, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result, ResponseMessage_1.ResponseMessage.USER_BLOCK_TOGGLED));
    });
    updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { name, role, organization, isBlocked } = req.body;
        const userContext = (0, userContext_1.extractUserContext)(req);
        const updatedUser = await this.adminUpdateUserUseCase.execute(id, {
            name,
            role,
            companyName: organization,
            isBlocked,
            userContext
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updatedUser, ResponseMessage_1.ResponseMessage.USER_UPDATED));
    });
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map