import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { eventBus } from "../../events/EventEmitterBus";

import { CreateEquipment } from "../../../application/useCases/CreateEquipment";
import { UpdateEquipment } from "../../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../../application/useCases/DeleteEquipment";
import { GetAllEquipment } from "../../../application/useCases/GetAllEquipment";
import { GetEquipmentHistory } from "../../../application/useCases/GetEquipmentHistory";
import { EquipmentController } from "../../../presentation/controllers/EquipmentController";

export const createEquipmentFactory = (repositories: Repositories, services: Services) => {
  const createEquipmentUseCase = new CreateEquipment(repositories.equipmentRepository, eventBus);
  const updateEquipmentUseCase = new UpdateEquipment(
    repositories.equipmentRepository,
    repositories.userRepository,
    eventBus,
    services.notificationService
  );
  const deleteEquipmentUseCase = new DeleteEquipment(repositories.equipmentRepository);
  const getAllEquipmentUseCase = new GetAllEquipment(repositories.equipmentRepository);
  const getEquipmentHistoryUseCase = new GetEquipmentHistory(repositories.equipmentHistoryRepository);
  
  const equipmentController = new EquipmentController(
    createEquipmentUseCase,
    updateEquipmentUseCase,
    deleteEquipmentUseCase,
    getAllEquipmentUseCase,
    getEquipmentHistoryUseCase
  );

  return {
    equipmentController
  };
};
