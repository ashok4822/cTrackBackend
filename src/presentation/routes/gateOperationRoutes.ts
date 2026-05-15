import { Router } from "express";
import { GateOperationController } from "../controllers/GateOperationController";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { GateOperationRepository } from "../../infrastructure/repositories/GateOperationRepository";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { VehicleRepository } from "../../infrastructure/repositories/VehicleRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { VehicleDomainService } from "../../domain/services/VehicleDomainService";
import { ContainerDomainService } from "../../domain/services/ContainerDomainService";
import { BlockDomainService } from "../../domain/services/BlockDomainService";
import { IVehicleDomainService } from "../../domain/services/IVehicleDomainService";
import { IContainerDomainService } from "../../domain/services/IContainerDomainService";
import { IBlockDomainService } from "../../domain/services/IBlockDomainService";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { IEventBus } from "../../domain/events/IEventBus";
import { createAuthMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createGateOperationRouter = (
    tokenService: ITokenService,
    config: IConfigService,
    eventBus: IEventBus
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    // Repositories
    const repository = new GateOperationRepository();
    const containerRepository = new ContainerRepository();
    const vehicleRepository = new VehicleRepository();
    const containerRequestRepository = new ContainerRequestRepository();
    const billRepository = new BillRepository();
    const userRepository = new UserRepository();
    const blockRepository = new BlockRepository();

    // Domain Services — typed as interfaces to enforce DIP
    const vehicleService: IVehicleDomainService = new VehicleDomainService(vehicleRepository);
    const containerService: IContainerDomainService = new ContainerDomainService(containerRepository, userRepository);
    const blockService: IBlockDomainService = new BlockDomainService(blockRepository);

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
