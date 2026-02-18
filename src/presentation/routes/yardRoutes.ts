import { Router } from "express";
import { YardController } from "../controllers/YardController";
import { GetBlocks } from "../../application/useCases/GetBlocks";
import { CreateBlock } from "../../application/useCases/CreateBlock";
import { UpdateBlock } from "../../application/useCases/UpdateBlock";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { MongoAuditLogRepository } from "../../infrastructure/repositories/MongoAuditLogRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export function createYardRouter(): Router {
    const router = Router();

    // DI
    const blockRepository = new BlockRepository();
    const auditLogRepository = new MongoAuditLogRepository();
    const getBlocksUseCase = new GetBlocks(blockRepository);
    const createBlockUseCase = new CreateBlock(blockRepository, auditLogRepository);
    const updateBlockUseCase = new UpdateBlock(blockRepository, auditLogRepository);

    const yardController = new YardController(
        getBlocksUseCase,
        createBlockUseCase,
        updateBlockUseCase
    );

    // Routes
    // Both admins and operators need to see the configuration
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        yardController.getBlocks(req, res)
    );

    // Only admins can create or update the configuration
    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        yardController.createBlock(req, res)
    );

    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        yardController.updateBlock(req, res)
    );

    return router;
}
