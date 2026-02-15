import { Router } from "express";
import { YardController } from "../controllers/YardController";
import { GetYardBlocks } from "../../application/useCases/GetYardBlocks";
import { CreateYardBlock } from "../../application/useCases/CreateYardBlock";
import { UpdateYardBlock } from "../../application/useCases/UpdateYardBlock";
import { MongoYardBlockRepository } from "../../infrastructure/repositories/MongoYardBlockRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export function createYardRouter(): Router {
    const router = Router();

    // DI
    const yardBlockRepository = new MongoYardBlockRepository();
    const getYardBlocksUseCase = new GetYardBlocks(yardBlockRepository);
    const createYardBlockUseCase = new CreateYardBlock(yardBlockRepository);
    const updateYardBlockUseCase = new UpdateYardBlock(yardBlockRepository);

    const yardController = new YardController(
        getYardBlocksUseCase,
        createYardBlockUseCase,
        updateYardBlockUseCase
    );

    // Routes
    // Both admins and operators might need to see the yard configuration
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        yardController.getYardBlocks(req, res)
    );

    // Only admins can create or update the configuration
    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        yardController.createYardBlock(req, res)
    );

    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        yardController.updateYardBlock(req, res)
    );

    return router;
}
