import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { eventBus } from "../../events/EventEmitterBus";
import { IConfigService } from "../../../application/services/IConfigService";

// Use Cases
import { Login } from "../../../application/useCases/Login";
import { RefreshToken } from "../../../application/useCases/RefreshToken";
import { GoogleLogin } from "../../../application/useCases/GoogleLogin";
import { InitiateSignup } from "../../../application/useCases/InitiateSignup";
import { VerifyOtpAndSignup } from "../../../application/useCases/VerifyOtpAndSignup";
import { ForgotPassword } from "../../../application/useCases/ForgotPassword";
import { ResetPassword } from "../../../application/useCases/ResetPassword";
import { VerifyResetOtp } from "../../../application/useCases/VerifyResetOtp";
import { GetUserProfile } from "../../../application/useCases/GetUserProfile";

// Controllers
import { AuthController } from "../../../presentation/controllers/AuthController";
import { SignupController } from "../../../presentation/controllers/SignupController";
import { PasswordController } from "../../../presentation/controllers/PasswordController";

export const createAuthFactory = (repositories: Repositories, services: Services, appConfig: IConfigService) => {
  const loginUseCase = new Login(
    repositories.userRepository,
    services.hashService,
    services.tokenService,
    eventBus
  );
  
  const refreshUseCase = new RefreshToken(
    repositories.userRepository,
    services.tokenService
  );
  
  const googleLoginUseCase = new GoogleLogin(
    repositories.userRepository,
    services.tokenService,
    services.googleAuthService,
    eventBus
  );
  
  const initiateSignupUseCase = new InitiateSignup(
    repositories.userRepository,
    repositories.otpRepository,
    services.emailService
  );
  
  const signupUseCase = new VerifyOtpAndSignup(
    repositories.userRepository,
    repositories.otpRepository,
    services.hashService,
    eventBus
  );
  
  const forgotPasswordUseCase = new ForgotPassword(
    repositories.userRepository,
    repositories.otpRepository,
    services.emailService
  );
  
  const resetPasswordUseCase = new ResetPassword(
    repositories.userRepository,
    repositories.otpRepository,
    services.hashService
  );
  
  const verifyResetOtpUseCase = new VerifyResetOtp(repositories.otpRepository);
  
  const getUserProfileUseCase = new GetUserProfile(repositories.userRepository);

  const authController = new AuthController(
    loginUseCase,
    refreshUseCase,
    googleLoginUseCase,
    getUserProfileUseCase,
    appConfig
  );
  
  const signupController = new SignupController(initiateSignupUseCase, signupUseCase);
  
  const passwordController = new PasswordController(
    forgotPasswordUseCase,
    resetPasswordUseCase,
    verifyResetOtpUseCase
  );

  return {
    authController,
    signupController,
    passwordController,
    // Provide any specific UseCases that other routers/factories might need
    getUserProfileUseCase
  };
};
