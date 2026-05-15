import { Router } from "express";
import { YardController } from "../controllers/YardController";
import { GetBlocks } from "../../application/useCases/GetBlocks";
import { CreateBlock } from "../../application/useCases/CreateBlock";
import { UpdateBlock } from "../../application/useCases/UpdateBlock";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { IEventBus } from "../../domain/events/IEventBus";
import { createAuthMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export function createYardRouter(
    tokenService: ITokenService,
    config: IConfigService,
    eventBus: IEventBus
): Router {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    // DI
    const blockRepository = new BlockRepository();

    const getBlocksUseCase = new GetBlocks(blockRepository);
    const createBlockUseCase = new CreateBlock(blockRepository, eventBus);
    const updateBlockUseCase = new UpdateBlock(blockRepository, eventBus);

    const yardController = new YardController(
        getBlocksUseCase,
        createBlockUseCase,
        updateBlockUseCase,
    );

    // Routes
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), yardController.getBlocks);
    router.post("/", authMiddleware, roleMiddleware(["admin"]), yardController.createBlock);
    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), yardController.updateBlock);

    return router;
}
