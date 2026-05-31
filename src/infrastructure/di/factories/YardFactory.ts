import { Repositories } from "../Repositories";
import { eventBus } from "../../events/EventEmitterBus";

import { GetBlocks } from "../../../application/useCases/GetBlocks";
import { CreateBlock } from "../../../application/useCases/CreateBlock";
import { UpdateBlock } from "../../../application/useCases/UpdateBlock";
import { YardController } from "../../../presentation/controllers/YardController";

export const createYardFactory = (repositories: Repositories) => {
  const getBlocksUseCase = new GetBlocks(repositories.blockRepository);
  const createBlockUseCase = new CreateBlock(repositories.blockRepository, eventBus);
  const updateBlockUseCase = new UpdateBlock(repositories.blockRepository, eventBus);
  
  const yardController = new YardController(getBlocksUseCase, createBlockUseCase, updateBlockUseCase);

  return {
    yardController
  };
};
