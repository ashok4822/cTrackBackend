import { Router } from "express";
import { AppContainer } from "../../infrastructure/di/AppContainer";

// Route Factories
import { createAuthRouter } from "./authRoutes";
import { createUserRouter } from "./userRoutes";
import { createYardRouter } from "./yardRoutes";
import { createShippingLineRouter } from "./shippingLineRoutes";
import { createContainerRouter } from "./containerRoutes";
import { createGateOperationRouter } from "./gateOperationRoutes";
import { createVehicleRouter } from "./vehicleRoutes";
import { createEquipmentRouter } from "./equipmentRoutes";
import { createBillingRouter } from "./billingRoutes";
import { createContainerRequestRouter } from "./containerRequestRoutes";
import { createPDARouter } from "./pdaRoutes";
import { createDashboardRouter } from "./dashboardRoutes";
import { createNotificationRouter } from "./notificationRoutes";
import { createSupportRouter } from "./supportRoutes";

// Validation Schemas & Limiters
import { authLimiter } from "../middlewares/rateLimiter";
import { loginSchema, signupSchema } from "../../infrastructure/validators/zod/auth.schema";

export const createApiRouter = (container: AppContainer): Router => {
  const apiRouter = Router();
  const { controllers, services, useCases } = container;

  // Mount API routers with their injected dependencies
  apiRouter.use(
    "/auth",
    authLimiter,
    createAuthRouter(
      services.tokenService,
      controllers.authController,
      controllers.signupController,
      controllers.passwordController,
      services.schemaValidator,
      { login: loginSchema, signup: signupSchema }
    )
  );

  apiRouter.use("/users", createUserRouter(services.tokenService, services.upload, controllers.userController, controllers.auditLogController));
  apiRouter.use("/yard", createYardRouter(services.tokenService, controllers.yardController));
  apiRouter.use("/shipping-lines", createShippingLineRouter(services.tokenService, controllers.shippingLineController));
  apiRouter.use("/containers", createContainerRouter(services.tokenService, useCases.getOverdueStatusUseCase, controllers.containerController));
  apiRouter.use("/gate-operations", createGateOperationRouter(services.tokenService, controllers.gateOperationController));
  apiRouter.use("/vehicles", createVehicleRouter(services.tokenService, controllers.vehicleController));
  apiRouter.use("/equipment", createEquipmentRouter(services.tokenService, controllers.equipmentController));
  apiRouter.use("/billing", createBillingRouter(services.tokenService, controllers.billingController, controllers.activityController, controllers.chargeController, controllers.cargoCategoryController));
  apiRouter.use("/container-requests", createContainerRequestRouter(services.tokenService, useCases.getOverdueStatusUseCase, controllers.containerRequestController));
  apiRouter.use("/pda", createPDARouter(services.tokenService, controllers.pdaController));
  apiRouter.use("/dashboard", createDashboardRouter(services.tokenService, controllers.dashboardController));
  apiRouter.use("/notifications", createNotificationRouter(services.tokenService, controllers.notificationController));
  apiRouter.use("/support", createSupportRouter(services.tokenService, controllers.supportController));

  return apiRouter;
};
