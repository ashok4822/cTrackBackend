import { Request, Response } from "express";
import { ILogin } from "../../application/ports/ILogin";
import { IRefreshToken } from "../../application/ports/IRefreshToken";
import { IGoogleLogin } from "../../application/ports/IGoogleLogin";
import { IGetUserProfile } from "../../application/ports/IGetUserProfile";
import { IConfigService } from "../../application/services/IConfigService";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AppError } from "../../domain/exceptions/AppError";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class AuthController {
  constructor(
    private readonly _loginUseCase: ILogin,
    private readonly _refreshTokenUseCase: IRefreshToken,
    private readonly _googleLoginUseCase: IGoogleLogin,
    private readonly _getUserProfileUseCase: IGetUserProfile,
    private readonly _configService: IConfigService
  ) { }


  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const user = await this._getUserProfileUseCase.execute(userId);
    return res.status(HttpStatus.OK).json(ApiResponse.success(user));
  });

  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { code, role } = req.body;
    const result = await this._googleLoginUseCase.execute(code, role);
    
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: this._configService.get("NODE_ENV") === "production",
      sameSite: "strict",
      maxAge: this._configService.getNumber("REFRESH_TOKEN_MAX_AGE") || 7 * 24 * 60 * 60 * 1000,
    });
    
    return res.status(HttpStatus.OK).json(ApiResponse.success({
      accessToken: result.accessToken,
      user: result.user,
    }, ResponseMessage.LOGIN_SUCCESS));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "unknown";
    
    const result = await this._loginUseCase.execute({ email, password, requiredRole: role, ipAddress });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: this._configService.get("NODE_ENV") === "production",
      sameSite: "strict",
      maxAge: this._configService.getNumber("REFRESH_TOKEN_MAX_AGE") || 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.OK).json(ApiResponse.success({
      accessToken: result.accessToken,
      user: result.user,
    }, ResponseMessage.LOGIN_SUCCESS));
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(ResponseMessage.TOKEN_MISSING, HttpStatus.UNAUTHORIZED);
    }

    const result = await this._refreshTokenUseCase.execute(refreshToken);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: this._configService.get("NODE_ENV") === "production",
      sameSite: "strict",
    });
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.LOGOUT_SUCCESS));
  });
}

