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
import { eventBus } from "../../infrastructure/events/EventEmitterBus";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { VehicleDomainService } from "../../domain/services/VehicleDomainService";
import { ContainerDomainService } from "../../domain/services/ContainerDomainService";
import { BlockDomainService } from "../../domain/services/BlockDomainService";

export const createGateOperationRouter = () => {
    const router = Router();
    
    // Repositories
    const repository = new GateOperationRepository();
    const containerRepository = new ContainerRepository();
    const vehicleRepository = new VehicleRepository();
    const containerRequestRepository = new ContainerRequestRepository();
    const billRepository = new BillRepository();
    const userRepository = new UserRepository();
    const blockRepository = new BlockRepository();

    // Domain Services
    const vehicleService = new VehicleDomainService(vehicleRepository);
    const containerService = new ContainerDomainService(containerRepository, userRepository);
    const blockService = new BlockDomainService(blockRepository);

    // Use Cases
    const getUseCase = new GetGateOperations(repository);
    const createUseCase = new CreateGateOperation(
        repository,
        vehicleRepository,
        containerRepository,
        containerRequestRepository,
        vehicleService,
        containerService,
        blockService,
        eventBus,
        billRepository
    );

    const controller = new GateOperationController(getUseCase, createUseCase);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), controller.getGateOperations);
    router.post("/", authMiddleware, roleMiddleware(["operator"]), controller.createGateOperation);

    return router;
};
