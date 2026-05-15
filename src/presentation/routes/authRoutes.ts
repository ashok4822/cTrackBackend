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
import { EmailService } from "../../infrastructure/services/EmailService";
import { GoogleAuthService } from "../../infrastructure/services/GoogleAuthService";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { IEventBus } from "../../domain/events/IEventBus";
import { validate } from "../middlewares/validate";
import { loginSchema, signupSchema } from "../../domain/validators/auth.schema";
import { createAuthMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createAuthRouter = (
    tokenService: ITokenService,
    config: IConfigService,
    eventBus: IEventBus
) => {
    const authRouter = Router();

    // Dependencies
    const userRepository = new UserRepository();
    const otpRepository = new OtpRepository();
    const hashService = new BcryptHashService();
    const emailService = new EmailService(config);
    const googleAuthService = new GoogleAuthService(config);

    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    // Use Cases
    const loginUseCase = new Login(userRepository, hashService, tokenService, config, eventBus);
    const refreshUseCase = new RefreshToken(userRepository, tokenService, config);
    const googleLoginUseCase = new GoogleLogin(userRepository, tokenService, googleAuthService, config, eventBus);
    const initiateSignupUseCase = new InitiateSignup(userRepository, otpRepository, emailService);
    const signupUseCase = new VerifyOtpAndSignup(userRepository, otpRepository, hashService, eventBus);
    const forgotPasswordUseCase = new ForgotPassword(userRepository, otpRepository, emailService);
    const verifyResetOtpUseCase = new VerifyResetOtp(otpRepository);
    const resetPasswordUseCase = new ResetPassword(userRepository, otpRepository, hashService);
    const getUserProfileUseCase = new GetUserProfile(userRepository);

    // Controllers
    const authController = new AuthController(loginUseCase, refreshUseCase, googleLoginUseCase, getUserProfileUseCase, config);
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
