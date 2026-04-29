import { Request, Response } from "express";
import { IForgotPassword } from "../../application/ports/IForgotPassword";
import { IResetPassword } from "../../application/ports/IResetPassword";
import { IVerifyResetOtp } from "../../application/ports/IVerifyResetOtp";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class PasswordController {
  constructor(
    private forgotPasswordUseCase: IForgotPassword,
    private resetPasswordUseCase: IResetPassword,
    private verifyResetOtpUseCase: IVerifyResetOtp,
  ) {}

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.forgotPasswordUseCase.execute(email);
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.PASSWORD_RESET_OTP_SENT));
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await this.resetPasswordUseCase.execute(email, otp, newPassword);
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.PASSWORD_RESET_SUCCESS));
  });

  verifyResetOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await this.verifyResetOtpUseCase.execute(email, otp);
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.OTP_VERIFIED));
  });
}

