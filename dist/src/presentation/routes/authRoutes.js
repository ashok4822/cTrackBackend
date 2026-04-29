"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const SignupController_1 = require("../controllers/SignupController");
const PasswordController_1 = require("../controllers/PasswordController");
const Login_1 = require("../../application/useCases/Login");
const RefreshToken_1 = require("../../application/useCases/RefreshToken");
const GoogleLogin_1 = require("../../application/useCases/GoogleLogin");
const InitiateSignup_1 = require("../../application/useCases/InitiateSignup");
const VerifyOtpAndSignup_1 = require("../../application/useCases/VerifyOtpAndSignup");
const ForgotPassword_1 = require("../../application/useCases/ForgotPassword");
const ResetPassword_1 = require("../../application/useCases/ResetPassword");
const VerifyResetOtp_1 = require("../../application/useCases/VerifyResetOtp");
const GetUserProfile_1 = require("../../application/useCases/GetUserProfile");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const OtpRepository_1 = require("../../infrastructure/repositories/OtpRepository");
const BcryptHashService_1 = require("../../infrastructure/services/BcryptHashService");
const JwtTokenService_1 = require("../../infrastructure/services/JwtTokenService");
const EmailService_1 = require("../../infrastructure/services/EmailService");
const appConfig_1 = require("../../infrastructure/config/appConfig");
const GoogleAuthService_1 = require("../../infrastructure/services/GoogleAuthService");
const validate_1 = require("../middlewares/validate");
const auth_schema_1 = require("../../domain/validators/auth.schema");
const EventEmitterBus_1 = require("../../infrastructure/events/EventEmitterBus");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const createAuthRouter = () => {
    const authRouter = (0, express_1.Router)();
    // Dependencies
    const userRepository = new UserRepository_1.UserRepository();
    const otpRepository = new OtpRepository_1.OtpRepository();
    const hashService = new BcryptHashService_1.BcryptHashService();
    const tokenService = new JwtTokenService_1.JwtTokenService();
    const emailService = new EmailService_1.EmailService();
    const googleAuthService = new GoogleAuthService_1.GoogleAuthService(appConfig_1.appConfig);
    // Use Cases
    const loginUseCase = new Login_1.Login(userRepository, hashService, tokenService, appConfig_1.appConfig, EventEmitterBus_1.eventBus);
    const refreshUseCase = new RefreshToken_1.RefreshToken(userRepository, tokenService, appConfig_1.appConfig);
    const googleLoginUseCase = new GoogleLogin_1.GoogleLogin(userRepository, tokenService, googleAuthService, appConfig_1.appConfig, EventEmitterBus_1.eventBus);
    const initiateSignupUseCase = new InitiateSignup_1.InitiateSignup(userRepository, otpRepository, emailService);
    const signupUseCase = new VerifyOtpAndSignup_1.VerifyOtpAndSignup(userRepository, otpRepository, hashService, EventEmitterBus_1.eventBus);
    const forgotPasswordUseCase = new ForgotPassword_1.ForgotPassword(userRepository, otpRepository, emailService);
    const verifyResetOtpUseCase = new VerifyResetOtp_1.VerifyResetOtp(otpRepository);
    const resetPasswordUseCase = new ResetPassword_1.ResetPassword(userRepository, otpRepository, hashService);
    const getUserProfileUseCase = new GetUserProfile_1.GetUserProfile(userRepository);
    // Controllers
    const authController = new AuthController_1.AuthController(loginUseCase, refreshUseCase, googleLoginUseCase, getUserProfileUseCase);
    const signupController = new SignupController_1.SignupController(initiateSignupUseCase, signupUseCase);
    const passwordController = new PasswordController_1.PasswordController(forgotPasswordUseCase, resetPasswordUseCase, verifyResetOtpUseCase);
    // Auth Routes
    authRouter.post("/login", (0, validate_1.validate)(auth_schema_1.loginSchema), authController.login);
    authRouter.post("/google", authController.googleLogin);
    authRouter.post("/logout", authController.logout);
    authRouter.post("/refresh-token", authController.refresh);
    authRouter.get("/me", authMiddleWare_1.authMiddleware, authController.getMe);
    // Signup Routes
    authRouter.post("/initiate-signup", signupController.initiateSignup);
    authRouter.post("/signup", (0, validate_1.validate)(auth_schema_1.signupSchema), signupController.signup);
    // Password Reset Routes
    authRouter.post("/forgot-password", passwordController.forgotPassword);
    authRouter.post("/verify-reset-otp", passwordController.verifyResetOtp);
    authRouter.post("/reset-password", passwordController.resetPassword);
    return authRouter;
};
exports.createAuthRouter = createAuthRouter;
//# sourceMappingURL=authRoutes.js.map