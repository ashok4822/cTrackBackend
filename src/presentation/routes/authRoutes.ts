import { Router } from "express";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { Login } from "../../application/useCases/Login";
import { CustomerSignup } from "../../application/useCases/CustomerSignup";
import { RefreshToken } from "../../application/useCases/RefreshToken";
import { AuthController } from "../controllers/AuthController";
import { GoogleLogin } from "../../application/useCases/GoogleLogin";

const authRouter = Router();

//DI
const userRepository = new MongoUserRepository();
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService();

const loginUseCase = new Login(userRepository, hashService, tokenService);
const signupUseCase = new CustomerSignup(userRepository, hashService);
const refreshUseCase = new RefreshToken(userRepository, tokenService);
const googleLoginUseCase = new GoogleLogin(
  userRepository,
  tokenService,
  process.env.GOOGLE_CLIENT_ID || "fallback",
);

const authController = new AuthController(
  loginUseCase,
  signupUseCase,
  refreshUseCase,
  googleLoginUseCase,
);

authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.post("/signup", (req, res) => authController.signup(req, res));
authRouter.post("/refresh-token", (req, res) =>
  authController.refresh(req, res),
);
authRouter.post("/google", (req, res) => authController.googleLogin(req, res));

export { authRouter };
