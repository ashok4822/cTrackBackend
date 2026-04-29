import { Request, Response } from "express";
import { IInitiateSignup } from "../../application/ports/IInitiateSignup";
import { IVerifyOtpAndSignup } from "../../application/ports/IVerifyOtpAndSignup";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class SignupController {
  constructor(
    private initiateSignupUseCase: IInitiateSignup,
    private verifyOtpAndSignupUseCase: IVerifyOtpAndSignup,
  ) {}

  initiateSignup = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.initiateSignupUseCase.execute(email);
    return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.SIGNUP_INITIATED));
  });

  signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, otp } = req.body;
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
    
    await this.verifyOtpAndSignupUseCase.execute({ email, otp, password, name, ipAddress });
    
    return res.status(HttpStatus.CREATED).json(ApiResponse.success(null, ResponseMessage.SIGNUP_SUCCESS));
  });
}

