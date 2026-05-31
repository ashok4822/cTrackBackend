import { Router } from "express";
import { ISchemaValidator } from "../../application/services/ISchemaValidator";
import { AuthController } from "../controllers/AuthController";
import { SignupController } from "../controllers/SignupController";
import { PasswordController } from "../controllers/PasswordController";
import { ITokenService } from "../../application/services/ITokenService";
import { validate } from "../middlewares/validate";
import { createAuthMiddleware } from "../middlewares/authMiddleware";

export const createAuthRouter = (
    tokenService: ITokenService,
    authController: AuthController,
    signupController: SignupController,
    passwordController: PasswordController,
    validator: ISchemaValidator,
    schemas: { login: unknown; signup: unknown }
) => {
    const authRouter = Router();

    const authMiddleware = createAuthMiddleware(tokenService);

    // Auth Routes
    authRouter.post("/login", validate(schemas.login, validator.validate.bind(validator)), authController.login);
    authRouter.post("/google", authController.googleLogin);
    authRouter.post("/logout", authController.logout);
    authRouter.post("/refresh-token", authController.refresh);
    authRouter.get("/me", authMiddleware, authController.getMe);

    // Signup Routes
    authRouter.post("/initiate-signup", signupController.initiateSignup);
    authRouter.post("/signup", validate(schemas.signup, validator.validate.bind(validator)), signupController.signup);

    // Password Reset Routes
    authRouter.post("/forgot-password", passwordController.forgotPassword);
    authRouter.post("/verify-reset-otp", passwordController.verifyResetOtp);
    authRouter.post("/reset-password", passwordController.resetPassword);

    return authRouter;
};
