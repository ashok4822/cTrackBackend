import { Repositories } from "../Repositories";
import { eventBus } from "../../events/EventEmitterBus";

import { CreateContainer } from "../../../application/useCases/CreateContainer";
import { GetAllContainers } from "../../../application/useCases/GetAllContainers";
import { GetContainerById } from "../../../application/useCases/GetContainerById";
import { UpdateContainer } from "../../../application/useCases/UpdateContainer";
import { BlacklistContainer } from "../../../application/useCases/BlacklistContainer";
import { UnblacklistContainer } from "../../../application/useCases/UnblacklistContainer";
import { GetContainerHistory } from "../../../application/useCases/GetContainerHistory";
import { GetCustomerContainers } from "../../../application/useCases/GetCustomerContainers";
import { ContainerController } from "../../../presentation/controllers/ContainerController";

export const createContainerFactory = (repositories: Repositories) => {
  const createContainerUseCase = new CreateContainer(repositories.containerRepository, eventBus);
  const getAllContainersUseCase = new GetAllContainers(repositories.containerRepository);
  const getContainerByIdUseCase = new GetContainerById(repositories.containerRepository);
  const updateContainerUseCase = new UpdateContainer(
    repositories.containerRepository,
    repositories.equipmentRepository,
    repositories.blockRepository,
    eventBus
  );
  const blacklistContainerUseCase = new BlacklistContainer(repositories.containerRepository, eventBus);
  const unblacklistContainerUseCase = new UnblacklistContainer(repositories.containerRepository, eventBus);
  const getContainerHistoryUseCase = new GetContainerHistory(repositories.containerHistoryRepository);
  const getCustomerContainersUseCase = new GetCustomerContainers(
    repositories.containerRepository,
    repositories.containerRequestRepository
  );

  const containerController = new ContainerController(
    createContainerUseCase,
    getAllContainersUseCase,
    getContainerByIdUseCase,
    updateContainerUseCase,
    blacklistContainerUseCase,
    unblacklistContainerUseCase,
    getContainerHistoryUseCase,
    getCustomerContainersUseCase
  );

  return {
    containerController,
    getContainerByIdUseCase // Exported for ContainerRequestFactory
  };
};
