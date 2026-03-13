import { Router } from "express";
import { GateOperationController } from "../controllers/GateOperationController";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { GateOperationRepository } from "../../infrastructure/repositories/GateOperationRepository";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { VehicleRepository } from "../../infrastructure/repositories/VehicleRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { MongoAuditLogRepository } from "../../infrastructure/repositories/MongoAuditLogRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";

export const createGateOperationRouter = () => {
    const router = Router();
    const repository = new GateOperationRepository();
    const containerRepository = new ContainerRepository();
    const vehicleRepository = new VehicleRepository();
    const historyRepository = new ContainerHistoryRepository();
    const containerRequestRepository = new ContainerRequestRepository();
    const billRepository = new BillRepository();
    const userRepository = new UserRepository();
    const blockRepository = new BlockRepository();
    const auditLogRepository = new MongoAuditLogRepository();

    const getUseCase = new GetGateOperations(repository);
    const createUseCase = new CreateGateOperation(
        repository,
        vehicleRepository,
        containerRepository,
        historyRepository,
        containerRequestRepository,
        userRepository,
        blockRepository,
        auditLogRepository,
        billRepository
    );

    const controller = new GateOperationController(getUseCase, createUseCase);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getGateOperations(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.createGateOperation(req, res)
    );

    return router;
};
