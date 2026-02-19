import { Router } from "express";
import { GateOperationController } from "../controllers/GateOperationController";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { GateOperationRepository } from "../../infrastructure/repositories/GateOperationRepository";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createGateOperationRouter = () => {
    const router = Router();
    const gateOpRepository = new GateOperationRepository();
    const containerRepository = new ContainerRepository();
    const historyRepository = new ContainerHistoryRepository();

    const createUseCase = new CreateGateOperation(gateOpRepository, containerRepository, historyRepository);
    const getUseCase = new GetGateOperations(gateOpRepository);
    const controller = new GateOperationController(createUseCase, getUseCase);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.getGateOperations(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.createGateOperation(req, res)
    );

    return router;
};
