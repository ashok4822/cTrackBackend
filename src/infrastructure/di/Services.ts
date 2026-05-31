import { BcryptHashService } from "../services/BcryptHashService";
import { EmailService } from "../services/EmailService";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { RazorpayService } from "../services/RazorpayService";
import { MongooseIdValidator } from "../services/MongooseIdValidator";
import { GroqAIService } from "../services/GroqAIService";
import { ZodSchemaValidator } from "../services/ZodSchemaValidator";
import { SocketService } from "../services/socketService";
import { JwtTokenService } from "../services/JwtTokenService";
import { SocketNotificationService } from "../services/SocketNotificationService";
import { createUploadProvider } from "../services/UploadService";
import { AIChatContextBuilder } from "../../application/services/AIChatContextBuilder";
import { VehicleDomainService } from "../../domain/services/VehicleDomainService";
import { ContainerDomainService } from "../../domain/services/ContainerDomainService";
import { BlockDomainService } from "../../domain/services/BlockDomainService";
import { BillingDomainService } from "../../domain/services/BillingDomainService";
import { ITokenService } from "../../application/services/ITokenService";
import { INotificationService } from "../../application/services/INotificationService";
import { IConfigService } from "../../application/services/IConfigService";
import { Repositories } from "./Repositories";

export const createServices = (appConfig: IConfigService, repositories: Repositories) => {
  const hashService = new BcryptHashService();
  const emailService = new EmailService(appConfig);
  const googleAuthService = new GoogleAuthService(appConfig);
  const paymentService = new RazorpayService(appConfig);
  const idValidator = new MongooseIdValidator();
  const schemaValidator = new ZodSchemaValidator();
  const aiService = new GroqAIService(appConfig);

  const contextBuilder = new AIChatContextBuilder(
    repositories.containerRepository,
    repositories.containerRequestRepository,
    repositories.billRepository,
    repositories.pdaRepository
  );

  const socketService = new SocketService();
  const tokenService: ITokenService = new JwtTokenService(appConfig);
  const notificationService: INotificationService = new SocketNotificationService(
    socketService,
    repositories.notificationRepository
  );
  const upload = createUploadProvider(appConfig);

  const vehicleDomainService = new VehicleDomainService(repositories.vehicleRepository);
  const containerDomainService = new ContainerDomainService(
    repositories.containerRepository,
    repositories.userRepository
  );
  const blockDomainService = new BlockDomainService(repositories.blockRepository);
  const billingDomainService = new BillingDomainService(
    repositories.containerRepository,
    repositories.billRepository,
    repositories.activityRepository,
    repositories.chargeRepository
  );

  return {
    hashService,
    emailService,
    googleAuthService,
    paymentService,
    idValidator,
    schemaValidator,
    aiService,
    contextBuilder,
    socketService,
    tokenService,
    notificationService,
    upload,
    vehicleDomainService,
    containerDomainService,
    blockDomainService,
    billingDomainService,
  };
};

export type Services = ReturnType<typeof createServices>;
