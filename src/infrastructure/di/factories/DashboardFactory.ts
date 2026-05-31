import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { IConfigService } from "../../../application/services/IConfigService";

import { GetDashboardKPIs } from "../../../application/useCases/GetDashboardKPIs";
import { DashboardController } from "../../../presentation/controllers/DashboardController";

export const createDashboardFactory = (repositories: Repositories, services: Services, appConfig: IConfigService) => {
  const getDashboardKPIsUseCase = new GetDashboardKPIs(
    repositories.containerRepository,
    repositories.gateOperationRepository,
    repositories.blockRepository,
    repositories.containerHistoryRepository,
    repositories.containerRequestRepository,
    repositories.equipmentRepository,
    repositories.billRepository,
    repositories.pdaRepository,
    services.idValidator,
    appConfig
  );
  
  const dashboardController = new DashboardController(getDashboardKPIsUseCase);

  return {
    dashboardController
  };
};
