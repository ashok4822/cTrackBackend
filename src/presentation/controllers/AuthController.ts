import { Request, Response } from "express";
import { Login } from "../../application/useCases/Login";
import { CustomerSignup } from "../../application/useCases/CustomerSignup";
import { RefreshToken } from "../../application/useCases/RefreshToken";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { GoogleLogin } from "../../application/useCases/GoogleLogin";
import { InitiateSignup } from "../../application/useCases/InitiateSignup";
import { VerifyOtpAndSignup } from "../../application/useCases/VerifyOtpAndSignup";
import { ForgotPassword } from "../../application/useCases/ForgotPassword";
import { ResetPassword } from "../../application/useCases/ResetPassword";
import { VerifyResetOtp } from "../../application/useCases/VerifyResetOtp";

export class AuthController {
  constructor(
    private loginUseCase: Login,
    private customerSignUpUseCase: CustomerSignup,
    private refrershTokenUseCase: RefreshToken,
    private googleLoginUseCase: GoogleLogin,
    private initiateSignupUseCase: InitiateSignup,
    private verifyOtpAndSignupUseCase: VerifyOtpAndSignup,
    private forgotPasswordUseCase: ForgotPassword,
    private resetPasswordUseCase: ResetPassword,
    private verifyResetOtpUseCase: VerifyResetOtp,
  ) { }

  async initiateSignup(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email is required" });
      }

      await this.initiateSignupUseCase.execute(email);
      return res
        .status(HttpStatus.OK)
        .json({ message: "OTP sent to email" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const { code, role } = req.body;
      if (!code) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Google authorization code is required" });
      }
      const result = await this.googleLoginUseCase.execute(code, role);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(HttpStatus.OK).json({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error: unknown) {
      console.error("Google Login Error in Controller:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;

      // Validation
      if (!email || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email and password are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Invalid email format" });
      }

      const result = await this.loginUseCase.execute(email, password, role);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      });

      return res.status(HttpStatus.OK).json({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { email, password, name, otp } = req.body;

      // Validation
      if (!email || !password || !name || !otp) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email, password, name, and OTP are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Invalid email format" });
      }

      if (password.length < 6) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Password must be at least 6 characters long" });
      }

      await this.verifyOtpAndSignupUseCase.execute(email, otp, password, name);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Customer created successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Refresh token missing" });
      }

      const result = await this.refrershTokenUseCase.execute(refreshToken);
      return res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  }


  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email is required" });
      }

      await this.forgotPasswordUseCase.execute(email);
      return res
        .status(HttpStatus.OK)
        .json({ message: "Password reset OTP sent to email" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
  
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email, OTP, and new password are required" });
      }

      if (newPassword.length < 6) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Password must be at least 6 characters" });
      }

      await this.resetPasswordUseCase.execute(email, otp, newPassword);
      return res
        .status(HttpStatus.OK)
        .json({ message: "Password reset successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async verifyResetOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email and OTP are required" });
      }

      await this.verifyResetOtpUseCase.execute(email, otp);
      return res
        .status(HttpStatus.OK)
        .json({ message: "OTP verified successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: "Logged out successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
}
