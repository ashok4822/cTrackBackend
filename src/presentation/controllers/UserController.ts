import { Request, Response } from "express";
import { IAdminCreateUser } from "../../application/ports/IAdminCreateUser";
import { IGetUserProfile } from "../../application/ports/IGetUserProfile";
import { IUpdateUserProfile } from "../../application/ports/IUpdateUserProfile";
import { IUpdatePassword } from "../../application/ports/IUpdatePassword";
import { IUpdateUserProfileImage } from "../../application/ports/IUpdateUserProfileImage";
import { IGetAllUsers } from "../../application/ports/IGetAllUsers";
import { IToggleUserBlockStatus } from "../../application/ports/IToggleUserBlockStatus";
import { IAdminUpdateUser } from "../../application/ports/IAdminUpdateUser";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AppError } from "../../domain/exceptions/AppError";
import { extractUserContext } from "../utils/userContext";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class UserController {
  constructor(
    private readonly _adminCreateUserUseCase: IAdminCreateUser,
    private readonly _getUserProfileUseCase: IGetUserProfile,
    private readonly _updateUserProfileUseCase: IUpdateUserProfile,
    private readonly _updatePasswordUseCase: IUpdatePassword,
    private readonly _updateProfileImageUseCase: IUpdateUserProfileImage,
    private readonly _getAllUsersUseCase: IGetAllUsers,
    private readonly _toggleUserBlockStatusUseCase: IToggleUserBlockStatus,
    private readonly _adminUpdateUserUseCase: IAdminUpdateUser
  ) { }

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, role, name } = req.body;
    const userContext = extractUserContext(req);
    const result = await this._adminCreateUserUseCase.execute({ email, role, name, userContext });
    return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, ResponseMessage.CREATE_SUCCESS));
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const user = await this._getUserProfileUseCase.execute(userId);
    if (!user) throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    return res.status(HttpStatus.OK).json(ApiResponse.success(user));
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const { name, phone, companyName } = req.body;
    const userContext = extractUserContext(req);
    const updatedUser = await this._updateUserProfileUseCase.execute(userId, { name, phone, companyName }, userContext);

    return res.status(HttpStatus.OK).json(ApiResponse.success(updatedUser, ResponseMessage.PROFILE_UPDATE_SUCCESS));
  });

  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      throw new AppError(ResponseMessage.PASSWORD_MISMATCH, HttpStatus.BAD_REQUEST);
    }

    const userContext = extractUserContext(req);
    await this._updatePasswordUseCase.execute(userId, currentPassword, newPassword, confirmPassword, userContext);
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.PASSWORD_UPDATE_SUCCESS));
  });

  updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    if (!req.file) throw new AppError(ResponseMessage.NO_FILE_UPLOADED, HttpStatus.BAD_REQUEST);

    const imageUrl = req.file.path;
    const updatedUser = await this._updateProfileImageUseCase.execute(userId, imageUrl);

    return res.status(HttpStatus.OK).json(ApiResponse.success({ profileImage: updatedUser.profileImage }, ResponseMessage.PROFILE_IMAGE_UPDATE_SUCCESS));
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._getAllUsersUseCase.execute();
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  });

  toggleBlockStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userContext = extractUserContext(req);
    const result = await this._toggleUserBlockStatusUseCase.execute(id as string, userContext);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result, ResponseMessage.USER_BLOCK_TOGGLED));
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, role, organization, isBlocked } = req.body;
    const userContext = extractUserContext(req);
    const updatedUser = await this._adminUpdateUserUseCase.execute(id as string, {
      name,
      role,
      companyName: organization,
      isBlocked,
      userContext
    });

    return res.status(HttpStatus.OK).json(ApiResponse.success(updatedUser, ResponseMessage.USER_UPDATED));
  });
}

