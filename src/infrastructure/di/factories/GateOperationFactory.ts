import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { eventBus } from "../../events/EventEmitterBus";

import { GetGateOperations } from "../../../application/useCases/GetGateOperations";
import { CreateGateOperation } from "../../../application/useCases/CreateGateOperation";
import { GateOperationController } from "../../../presentation/controllers/GateOperationController";

export const createGateOperationFactory = (repositories: Repositories, services: Services) => {
  const getGateOperationsUseCase = new GetGateOperations(repositories.gateOperationRepository);
  
  const createGateOperationUseCase = new CreateGateOperation(
    repositories.gateOperationRepository,
    repositories.vehicleRepository,
    repositories.containerRepository,
    repositories.containerRequestRepository,
    services.vehicleDomainService,
    services.containerDomainService,
    services.blockDomainService,
    eventBus,
    repositories.billRepository
  );
  
  const gateOperationController = new GateOperationController(
    getGateOperationsUseCase,
    createGateOperationUseCase
  );

  return {
    gateOperationController
  };
};
