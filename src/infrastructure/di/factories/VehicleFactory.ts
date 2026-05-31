import { Repositories } from "../Repositories";

import { CreateVehicle } from "../../../application/useCases/CreateVehicle";
import { UpdateVehicle } from "../../../application/useCases/UpdateVehicle";
import { DeleteVehicle } from "../../../application/useCases/DeleteVehicle";
import { GetAllVehicles } from "../../../application/useCases/GetAllVehicles";
import { VehicleController } from "../../../presentation/controllers/VehicleController";

export const createVehicleFactory = (repositories: Repositories) => {
  const createVehicleUseCase = new CreateVehicle(repositories.vehicleRepository);
  const updateVehicleUseCase = new UpdateVehicle(repositories.vehicleRepository);
  const deleteVehicleUseCase = new DeleteVehicle(repositories.vehicleRepository);
  const getAllVehiclesUseCase = new GetAllVehicles(repositories.vehicleRepository);
  
  const vehicleController = new VehicleController(
    createVehicleUseCase,
    updateVehicleUseCase,
    deleteVehicleUseCase,
    getAllVehiclesUseCase
  );

  return {
    vehicleController
  };
};
