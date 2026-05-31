import { createRepositories } from "./Repositories";
import { createServices } from "./Services";
import { initializeEventHandlers } from "./EventHandlers";
import { IConfigService } from "../../application/services/IConfigService";

import { createAuthFactory } from "./factories/AuthFactory";
import { createUserFactory } from "./factories/UserFactory";
import { createYardFactory } from "./factories/YardFactory";
import { createShippingLineFactory } from "./factories/ShippingLineFactory";
import { createContainerFactory } from "./factories/ContainerFactory";
import { createGateOperationFactory } from "./factories/GateOperationFactory";
import { createVehicleFactory } from "./factories/VehicleFactory";
import { createEquipmentFactory } from "./factories/EquipmentFactory";
import { createBillingFactory } from "./factories/BillingFactory";
import { createContainerRequestFactory } from "./factories/ContainerRequestFactory";
import { createPDAFactory } from "./factories/PDAFactory";
import { createDashboardFactory } from "./factories/DashboardFactory";
import { createNotificationFactory } from "./factories/NotificationFactory";
import { createSupportFactory } from "./factories/SupportFactory";

export const initializeAppContainer = (appConfig: IConfigService) => {
  const repositories = createRepositories();
  const services = createServices(appConfig, repositories);
  
  // Initialize all event listeners
  initializeEventHandlers(repositories, services);

  // Initialize Factories
  const auth = createAuthFactory(repositories, services, appConfig);
  const user = createUserFactory(repositories, services, auth.getUserProfileUseCase);
  const yard = createYardFactory(repositories);
  const shippingLine = createShippingLineFactory(repositories);
  const container = createContainerFactory(repositories);
  const gateOperation = createGateOperationFactory(repositories, services);
  const vehicle = createVehicleFactory(repositories);
  const equipment = createEquipmentFactory(repositories, services);
  const billing = createBillingFactory(repositories, services, appConfig);
  const containerRequest = createContainerRequestFactory(repositories, services, container.getContainerByIdUseCase);
  const pda = createPDAFactory(repositories, services, appConfig);
  const dashboard = createDashboardFactory(repositories, services, appConfig);
  const notification = createNotificationFactory(repositories);
  const support = createSupportFactory(services, appConfig);

  return {
    services, // Expose infrastructure services like tokenService, upload, schemaValidator
    controllers: {
      authController: auth.authController,
      signupController: auth.signupController,
      passwordController: auth.passwordController,
      userController: user.userController,
      auditLogController: user.auditLogController,
      yardController: yard.yardController,
      shippingLineController: shippingLine.shippingLineController,
      containerController: container.containerController,
      gateOperationController: gateOperation.gateOperationController,
      vehicleController: vehicle.vehicleController,
      equipmentController: equipment.equipmentController,
      activityController: billing.activityController,
      chargeController: billing.chargeController,
      cargoCategoryController: billing.cargoCategoryController,
      billingController: billing.billingController,
      containerRequestController: containerRequest.containerRequestController,
      pdaController: pda.pdaController,
      dashboardController: dashboard.dashboardController,
      notificationController: notification.notificationController,
      supportController: support.supportController
    },
    useCases: {
      getOverdueStatusUseCase: billing.getOverdueStatusUseCase
    }
  };
};

export type AppContainer = ReturnType<typeof initializeAppContainer>;
