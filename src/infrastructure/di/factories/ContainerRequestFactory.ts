import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { eventBus } from "../../events/EventEmitterBus";

import { CreateContainerRequest } from "../../../application/useCases/CreateContainerRequest";
import { GetCustomerRequests } from "../../../application/useCases/GetCustomerRequests";
import { GetContainerRequestById } from "../../../application/useCases/GetContainerRequestById";
import { GetAllContainerRequests } from "../../../application/useCases/GetAllContainerRequests";
import { UpdateContainerRequest } from "../../../application/useCases/UpdateContainerRequest";
import { GetContainerById } from "../../../application/useCases/GetContainerById";
import { ContainerRequestController } from "../../../presentation/controllers/ContainerRequestController";

export const createContainerRequestFactory = (
  repositories: Repositories,
  services: Services,
  getContainerByIdUseCase: GetContainerById
) => {
  const createContainerRequestUseCase = new CreateContainerRequest(
    repositories.containerRequestRepository,
    repositories.userRepository,
    services.notificationService,
    eventBus
  );
  
  const getCustomerRequestsUseCase = new GetCustomerRequests(repositories.containerRequestRepository);
  const getContainerRequestByIdUseCase = new GetContainerRequestById(repositories.containerRequestRepository);
  const getAllContainerRequestsUseCase = new GetAllContainerRequests(repositories.containerRequestRepository);
  
  const updateContainerRequestUseCase = new UpdateContainerRequest(
    repositories.containerRequestRepository,
    eventBus,
    services.billingDomainService,
    repositories.containerRepository,
    repositories.billRepository,
    services.notificationService
  );

  const containerRequestController = new ContainerRequestController(
    createContainerRequestUseCase,
    getCustomerRequestsUseCase,
    getContainerByIdUseCase, // Passed from ContainerFactory
    getAllContainerRequestsUseCase,
    updateContainerRequestUseCase,
    getContainerRequestByIdUseCase
  );

  return {
    containerRequestController
  };
};
