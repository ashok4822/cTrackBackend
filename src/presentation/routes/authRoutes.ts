import { Router } from "express";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { Login } from "../../application/useCases/Login";
import { CustomerSignup } from "../../application/useCases/CustomerSignup";
import { RefreshToken } from "../../application/useCases/RefreshToken";
import { AuthController } from "../controllers/AuthController";
import { GoogleLogin } from "../../application/useCases/GoogleLogin";
import { InitiateSignup } from "../../application/useCases/InitiateSignup";
import { VerifyOtpAndSignup } from "../../application/useCases/VerifyOtpAndSignup";
import { EmailService } from "../../infrastructure/services/EmailService";
import { OtpRepository } from "../../infrastructure/repositories/OtpRepository";
import { ForgotPassword } from "../../application/useCases/ForgotPassword";
import { ResetPassword } from "../../application/useCases/ResetPassword";

export const createAuthRouter = () => {
  const authRouter = Router();

  //DI
  const userRepository = new MongoUserRepository();
  const otpRepository = new OtpRepository();
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();
  const emailService = new EmailService();

  const loginUseCase = new Login(userRepository, hashService, tokenService);
  const signupUseCase = new CustomerSignup(userRepository, hashService);
  const refreshUseCase = new RefreshToken(userRepository, tokenService);
  const googleLoginUseCase = new GoogleLogin(
    userRepository,
    tokenService,
    process.env.GOOGLE_CLIENT_ID || "fallback",
    process.env.GOOGLE_CLIENT_SECRET || "fallback",
  );
  const initiateSignupUseCase = new InitiateSignup(
    userRepository,
    otpRepository,
    emailService,
  );
  const verifyOtpAndSignupUseCase = new VerifyOtpAndSignup(
    userRepository,
    otpRepository,
    hashService,
  );
  const forgotPasswordUseCase = new ForgotPassword(
    userRepository,
    otpRepository,
    emailService,
  );
  const resetPasswordUseCase = new ResetPassword(
    userRepository,
    otpRepository,
    hashService,
  );

  const authController = new AuthController(
    loginUseCase,
    signupUseCase,
    refreshUseCase,
    googleLoginUseCase,
    initiateSignupUseCase,
    verifyOtpAndSignupUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
  );

  authRouter.post("/login", (req, res) => authController.login(req, res));
  authRouter.post("/initiate-signup", (req, res) =>
    authController.initiateSignup(req, res),
  );
  authRouter.post("/signup", (req, res) => authController.signup(req, res));
  authRouter.post("/refresh-token", (req, res) =>
    authController.refresh(req, res),
  );
  authRouter.post("/google", (req, res) => authController.googleLogin(req, res));
  authRouter.post("/logout", (req, res) => authController.logout(req, res));
  authRouter.post("/forgot-password", (req, res) =>
    authController.forgotPassword(req, res),
  );
  authRouter.post("/reset-password", (req, res) =>
    authController.resetPassword(req, res),
  );

  return authRouter;
};
