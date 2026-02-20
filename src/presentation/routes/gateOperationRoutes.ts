import { Router } from "express";
import { GateOperationController } from "../controllers/GateOperationController";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { GateOperationRepository } from "../../infrastructure/repositories/GateOperationRepository";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createGateOperationRouter = () => {
    const router = Router();
    const repository = new GateOperationRepository();
    const containerRepository = new ContainerRepository();
    const historyRepository = new ContainerHistoryRepository();

    const getUseCase = new GetGateOperations(repository);
    const createUseCase = new CreateGateOperation(repository, containerRepository, historyRepository);

    const controller = new GateOperationController(getUseCase, createUseCase);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getGateOperations(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.createGateOperation(req, res)
    );

    return router;
};
