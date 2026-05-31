import { Services } from "../Services";
import { IConfigService } from "../../../application/services/IConfigService";

import { SupportUseCase } from "../../../application/useCases/SupportUseCase";
import { SupportController } from "../../../presentation/controllers/SupportController";

export const createSupportFactory = (services: Services, appConfig: IConfigService) => {
  const supportUseCase = new SupportUseCase(services.contextBuilder, services.aiService);
  const supportController = new SupportController(supportUseCase, appConfig);

  return {
    supportController
  };
};
