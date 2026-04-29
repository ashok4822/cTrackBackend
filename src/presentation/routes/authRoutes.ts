import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { SignupController } from "../controllers/SignupController";
import { PasswordController } from "../controllers/PasswordController";
import { Login } from "../../application/useCases/Login";
import { RefreshToken } from "../../application/useCases/RefreshToken";
import { GoogleLogin } from "../../application/useCases/GoogleLogin";
import { InitiateSignup } from "../../application/useCases/InitiateSignup";
import { VerifyOtpAndSignup } from "../../application/useCases/VerifyOtpAndSignup";
import { ForgotPassword } from "../../application/useCases/ForgotPassword";
import { ResetPassword } from "../../application/useCases/ResetPassword";
import { VerifyResetOtp } from "../../application/useCases/VerifyResetOtp";
import { GetUserProfile } from "../../application/useCases/GetUserProfile";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { OtpRepository } from "../../infrastructure/repositories/OtpRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { EmailService } from "../../infrastructure/services/EmailService";
import { appConfig } from "../../infrastructure/config/appConfig";
import { GoogleAuthService } from "../../infrastructure/services/GoogleAuthService";
import { validate } from "../middlewares/validate";
import { loginSchema, signupSchema } from "../../domain/validators/auth.schema";
import { eventBus } from "../../infrastructure/events/EventEmitterBus";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createAuthRouter = () => {
    const authRouter = Router();

    // Dependencies
    const userRepository = new UserRepository();
    const otpRepository = new OtpRepository();
    const hashService = new BcryptHashService();
    const tokenService = new JwtTokenService();
    const emailService = new EmailService();
    const googleAuthService = new GoogleAuthService(appConfig);

    // Use Cases
    const loginUseCase = new Login(userRepository, hashService, tokenService, appConfig, eventBus);
    const refreshUseCase = new RefreshToken(userRepository, tokenService, appConfig);
    const googleLoginUseCase = new GoogleLogin(userRepository, tokenService, googleAuthService, appConfig, eventBus);
    const initiateSignupUseCase = new InitiateSignup(userRepository, otpRepository, emailService);
    const signupUseCase = new VerifyOtpAndSignup(userRepository, otpRepository, hashService, eventBus);
    const forgotPasswordUseCase = new ForgotPassword(userRepository, otpRepository, emailService);
    const verifyResetOtpUseCase = new VerifyResetOtp(otpRepository);
    const resetPasswordUseCase = new ResetPassword(userRepository, otpRepository, hashService);
    const getUserProfileUseCase = new GetUserProfile(userRepository);

    // Controllers
    const authController = new AuthController(loginUseCase, refreshUseCase, googleLoginUseCase, getUserProfileUseCase);
    const signupController = new SignupController(initiateSignupUseCase, signupUseCase);
    const passwordController = new PasswordController(forgotPasswordUseCase, resetPasswordUseCase, verifyResetOtpUseCase);

    // Auth Routes
    authRouter.post("/login", validate(loginSchema), authController.login);
    authRouter.post("/google", authController.googleLogin);
    authRouter.post("/logout", authController.logout);
    authRouter.post("/refresh-token", authController.refresh);
    authRouter.get("/me", authMiddleware, authController.getMe);

    // Signup Routes
    authRouter.post("/initiate-signup", signupController.initiateSignup);
    authRouter.post("/signup", validate(signupSchema), signupController.signup);

    // Password Reset Routes
    authRouter.post("/forgot-password", passwordController.forgotPassword);
    authRouter.post("/verify-reset-otp", passwordController.verifyResetOtp);
    authRouter.post("/reset-password", passwordController.resetPassword);

    return authRouter;
};
