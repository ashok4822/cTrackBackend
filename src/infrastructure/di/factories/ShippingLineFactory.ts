import { Repositories } from "../Repositories";
import { eventBus } from "../../events/EventEmitterBus";

import { CreateShippingLine } from "../../../application/useCases/CreateShippingLine";
import { GetAllShippingLines } from "../../../application/useCases/GetAllShippingLines";
import { UpdateShippingLine } from "../../../application/useCases/UpdateShippingLine";
import { ShippingLineController } from "../../../presentation/controllers/ShippingLineController";

export const createShippingLineFactory = (repositories: Repositories) => {
  const createShippingLineUseCase = new CreateShippingLine(repositories.shippingLineRepository, eventBus);
  const getAllShippingLinesUseCase = new GetAllShippingLines(repositories.shippingLineRepository);
  const updateShippingLineUseCase = new UpdateShippingLine(repositories.shippingLineRepository, eventBus);
  
  const shippingLineController = new ShippingLineController(
    createShippingLineUseCase,
    getAllShippingLinesUseCase,
    updateShippingLineUseCase
  );

  return {
    shippingLineController
  };
};
